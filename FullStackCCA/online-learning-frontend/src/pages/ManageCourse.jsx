import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ManageCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
const [editForm, setEditForm] = useState({ title: '', description: '', price: 0 });
  const [lessons, setLessons] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
 const [lessonForm, setLessonForm] = useState({ title: '', video_type: 'youtube', video_url: '', content: '', order: 0 });
const [videoFile, setVideoFile] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [quizLessonId, setQuizLessonId] = useState(null);
  const [quizForm, setQuizForm] = useState({ title: '', questions: [{ question: '', options: ['', ''], correct_option: '' }] });
  const [message, setMessage] = useState('');
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '' });
const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

  const loadData = () => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data));
    api.get(`/courses/${id}/lessons`).then((res) => setLessons(res.data));
  };

  useEffect(() => { loadData(); }, [id]);

  useEffect(() => {
    if (course) {
      setEditForm({ title: course.title, description: course.description, price: course.price });
    }
  }, [course]);

 const handleAddLesson = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', lessonForm.title);
    formData.append('video_type', lessonForm.video_type);
    formData.append('content', lessonForm.content || '');
    formData.append('order', lessonForm.order || 0);

    if (lessonForm.video_type === 'youtube') {
      formData.append('video_url', lessonForm.video_url);
    } else if (videoFile) {
      formData.append('video_file', videoFile);
    }

    if (editingLessonId) {
      formData.append('_method', 'PUT');
      await api.post(`/instructor/lessons/${editingLessonId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditingLessonId(null);
    } else {
      await api.post(`/instructor/courses/${id}/lessons`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    setLessonForm({ title: '', video_type: 'youtube', video_url: '', content: '', order: 0 });
    setVideoFile(null);
    setShowLessonForm(false);
    loadData();
  };

  const startEditLesson = (lesson) => {
    setLessonForm({
      title: lesson.title,
      video_type: lesson.video_type || 'youtube',
      video_url: lesson.video_url || '',
      content: lesson.content || '',
      order: lesson.order || 0,
    });
    setVideoFile(null);
    setEditingLessonId(lesson.id);
    setShowLessonForm(true);
  };
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    await api.put(`/instructor/courses/${id}`, editForm);
    setShowEditForm(false);
    loadData();
    setMessage('Course updated!');
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Delete this course permanently? This cannot be undone.')) return;
    await api.delete(`/instructor/courses/${id}`);
    window.location.href = '/instructor';
  };

  const handleDeleteLesson = async (lessonId) => {
    await api.delete(`/instructor/lessons/${lessonId}`);
    loadData();
  };

  const updateQuestion = (idx, field, value) => {
    const questions = [...quizForm.questions];
    questions[idx][field] = value;
    setQuizForm({ ...quizForm, questions });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const questions = [...quizForm.questions];
    questions[qIdx].options[oIdx] = value;
    setQuizForm({ ...quizForm, questions });
  };

  const addQuestion = () => {
    setQuizForm({ ...quizForm, questions: [...quizForm.questions, { question: '', options: ['', ''], correct_option: '' }] });
  };

const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/instructor/courses/${id}/announcements`, announcementForm);
      setAnnouncementForm({ title: '', message: '' });
      setShowAnnouncementForm(false);
      setMessage('Announcement posted!');
    } catch (err) {
      setMessage('Failed to post announcement.');
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/instructor/lessons/${quizLessonId}/quiz`, quizForm);
      setMessage('Quiz created!');
      setQuizLessonId(null);
      setQuizForm({ title: '', questions: [{ question: '', options: ['', ''], correct_option: '' }] });
    } catch (err) {
      setMessage('Failed to create quiz (one may already exist for this lesson).');
    }
  };

  const inputStyle = {
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
  };

  if (!course) return <div className="max-w-4xl mx-auto px-6 py-12" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
      <Link to="/instructor" className="text-sm font-medium mb-4 inline-block" style={{ color: 'var(--color-text-muted)' }}>
        ← Back to dashboard
      </Link>

      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
          {course.title}
        </h1>
        <div className="flex gap-3">
         <button
          onClick={() => {
            if (showLessonForm) {
              setEditingLessonId(null);
              setLessonForm({ title: '', video_url: '', content: '', order: 0 });
            }
            setShowLessonForm(!showLessonForm);
          }}
          className="px-4 py-2 rounded-full font-display text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {showLessonForm ? 'Cancel' : '+ Add lesson'}
        </button>
          <button
            onClick={handleDeleteCourse}
            className="px-4 py-2 rounded-full font-display text-sm font-semibold"
            style={{ backgroundColor: 'color-mix(in srgb, red 15%, transparent)', color: '#EF4444' }}
          >
            Delete course
          </button>
        </div>
      </div>
      <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>Status: {course.status}</p>

      {showEditForm && (
        <form onSubmit={handleUpdateCourse} className="rounded-2xl border p-6 mb-8 space-y-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <input
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-lg border outline-none"
            style={inputStyle}
          />
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            required
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border outline-none"
            style={inputStyle}
          />
          <input
            type="number"
            value={editForm.price}
            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 rounded-lg border outline-none"
            style={inputStyle}
          />
          <button type="submit" className="px-6 py-2.5 rounded-full font-display font-semibold text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
            Save changes
          </button>
        </form>
      )}

      {message && <p className="mb-4 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>{message}</p>}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Lessons</h2>
        <button
          onClick={() => setShowLessonForm(!showLessonForm)}
          className="px-4 py-2 rounded-full font-display text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {showLessonForm ? 'Cancel' : '+ Add lesson'}
        </button>
      </div>

      {showLessonForm && (
        <form onSubmit={handleAddLesson} className="rounded-2xl border p-6 mb-6 space-y-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <input placeholder="Lesson title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border outline-none" style={inputStyle} />
         <div className="flex gap-3 mb-2">
            <button type="button" onClick={() => setLessonForm({ ...lessonForm, video_type: 'youtube' })}
              className="px-4 py-2 rounded-lg border text-sm font-medium"
              style={{ borderColor: lessonForm.video_type === 'youtube' ? 'var(--color-primary)' : 'var(--color-border)', color: 'var(--color-text)' }}>
              YouTube link
            </button>
            <button type="button" onClick={() => setLessonForm({ ...lessonForm, video_type: 'upload' })}
              className="px-4 py-2 rounded-lg border text-sm font-medium"
              style={{ borderColor: lessonForm.video_type === 'upload' ? 'var(--color-primary)' : 'var(--color-border)', color: 'var(--color-text)' }}>
              Upload video file
            </button>
          </div>

          {lessonForm.video_type === 'youtube' ? (
            <input placeholder="YouTube video URL" value={lessonForm.video_url} onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border outline-none" style={inputStyle} />
          ) : (
            <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo" onChange={(e) => setVideoFile(e.target.files[0])} className="w-full px-4 py-2.5 rounded-lg border outline-none" style={inputStyle} />
          )}
          <textarea placeholder="Lesson content" value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-lg border outline-none" style={inputStyle} />
          <input type="number" placeholder="Order" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border outline-none" style={inputStyle} />
          <button type="submit" className="px-6 py-2.5 rounded-full font-display font-semibold text-white" style={{ backgroundColor: 'var(--color-primary)' }}>Save lesson</button>
        </form>
      )}

      <div className="space-y-3 mb-10">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{lesson.title}</span>
              <div className="flex gap-3">
                <button onClick={() => startEditLesson(lesson)} className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                  Edit
                </button>
                <button onClick={() => setQuizLessonId(quizLessonId === lesson.id ? null : lesson.id)} className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                  {quizLessonId === lesson.id ? 'Cancel quiz' : '+ Add quiz'}
                </button>
                <button onClick={() => handleDeleteLesson(lesson.id)} className="text-sm font-medium" style={{ color: '#EF4444' }}>
                  Delete
                </button>
              </div>
            </div>

            {quizLessonId === lesson.id && (
              <form onSubmit={handleCreateQuiz} className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: 'var(--color-border)' }}>
                <input placeholder="Quiz title" value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} required className="w-full px-4 py-2.5 rounded-lg border outline-none" style={inputStyle} />

                {quizForm.questions.map((q, qIdx) => (
                  <div key={qIdx} className="rounded-lg border p-3 space-y-2" style={{ borderColor: 'var(--color-border)' }}>
                    <input placeholder="Question" value={q.question} onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)} required className="w-full px-3 py-2 rounded-lg border outline-none text-sm" style={inputStyle} />
                    {q.options.map((opt, oIdx) => (
                      <input key={oIdx} placeholder={`Option ${oIdx + 1}`} value={opt} onChange={(e) => updateOption(qIdx, oIdx, e.target.value)} required className="w-full px-3 py-2 rounded-lg border outline-none text-sm" style={inputStyle} />
                    ))}
                    <input placeholder="Correct option (must match one above exactly)" value={q.correct_option} onChange={(e) => updateQuestion(qIdx, 'correct_option', e.target.value)} required className="w-full px-3 py-2 rounded-lg border outline-none text-sm" style={inputStyle} />
                  </div>
                ))}

                <button type="button" onClick={addQuestion} className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                  + Add another question
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-full font-display font-semibold text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
            {editingLessonId ? 'Update lesson' : 'Save lesson'}
          </button>
              </form>
            )}
          </div>
        ))}
      </div>

         <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Announcements</h2>
        <button
          onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
          className="px-4 py-2 rounded-full font-display text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {showAnnouncementForm ? 'Cancel' : '+ Post announcement'}
        </button>
      </div>

      {showAnnouncementForm && (
        <form onSubmit={handlePostAnnouncement} className="rounded-2xl border p-6 space-y-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <input
            placeholder="Announcement title"
            value={announcementForm.title}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-lg border outline-none"
            style={inputStyle}
          />
          <textarea
            placeholder="Message"
            value={announcementForm.message}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
            required
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border outline-none"
            style={inputStyle}
          />
          <button type="submit" className="px-6 py-2.5 rounded-full font-display font-semibold text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
            Post
          </button>
        </form>
      )}
    </div>
  );
}
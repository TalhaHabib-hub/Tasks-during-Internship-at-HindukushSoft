import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Megaphone } from 'lucide-react';

function getEmbedUrl(url) {
  if (!url) return null;

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  return url;
}

export default function LessonViewer() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [progress, setProgress] = useState(null);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    api.get(`/courses/${courseId}`).then((res) => {
      setCourse(res.data);
      setLessons(res.data.lessons || []);
      if (res.data.lessons?.length > 0) setActiveLesson(res.data.lessons[0]);
    });

    api.get('/student/enrollments').then((res) => {
      const e = res.data.find((en) => en.course_id === Number(courseId));
      setEnrollment(e);
    });

    api.get(`/courses/${courseId}/announcements`).then((res) => setAnnouncements(res.data));
  }, [courseId]);

  useEffect(() => {
    if (enrollment) {
      refreshProgress();
    }
  }, [enrollment]);

  useEffect(() => {
    if (activeLesson) {
      setQuiz(null);
      setQuizResult(null);
      setQuizAnswers({});
      api.get(`/lessons/${activeLesson.id}/quiz`)
        .then((res) => setQuiz(res.data))
        .catch(() => setQuiz(null));

      // Clean up previous blob URL to avoid memory leaks
      if (videoBlobUrl) {
        URL.revokeObjectURL(videoBlobUrl);
        setVideoBlobUrl(null);
      }

      if (activeLesson.video_type === 'upload') {
        setVideoLoading(true);
        api.get(`/lessons/${activeLesson.id}/stream`, { responseType: 'blob' })
          .then((res) => {
            const url = URL.createObjectURL(res.data);
            setVideoBlobUrl(url);
          })
          .catch(() => setVideoBlobUrl(null))
          .finally(() => setVideoLoading(false));
      }
    }
  }, [activeLesson]);

  const refreshProgress = async () => {
    const res = await api.get('/student/enrollments');
    const e = res.data.find((en) => en.course_id === Number(courseId));
    setEnrollment(e);

    if (e) {
      const p = await api.get(`/enrollments/${e.id}/progress`);
      setProgress(p.data);
    }
  };

  const markComplete = async (lessonId) => {
    await api.post(`/lessons/${lessonId}/complete`);
    setCompletedIds((prev) => new Set([...prev, lessonId]));
    refreshProgress();
  };

  const submitQuiz = async () => {
    const res = await api.post(`/quizzes/${quiz.id}/submit`, { answers: quizAnswers });
    setQuizResult(res.data);
  };

  if (!course) {
    return <div className="max-w-6xl mx-auto px-6 py-12" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
      <Link to="/my-courses" className="text-sm font-medium mb-4 inline-block" style={{ color: 'var(--color-text-muted)' }}>
        ← Back to My Learning
      </Link>

      <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
        {course.title}
      </h1>

      {progress && (
        <div className="mb-8">
          <div className="w-full h-2 rounded-full mb-2" style={{ backgroundColor: 'var(--color-border)' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${progress.percentage}%`, backgroundColor: 'var(--color-primary)' }}
            />
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {progress.completed_lessons} / {progress.total_lessons} lessons complete · {progress.percentage}%
          </p>
        </div>
      )}

      {announcements.length > 0 && (
        <div className="mb-8 space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-surface)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Megaphone size={16} color="var(--color-primary)" />
                <p className="font-display font-semibold" style={{ color: 'var(--color-primary)' }}>{a.title}</p>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text)' }}>{a.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          {lessons.map((lesson, i) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className="w-full text-left px-4 py-3 rounded-xl border transition-colors"
              style={{
                borderColor: activeLesson?.id === lesson.id ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: activeLesson?.id === lesson.id ? 'var(--color-surface)' : 'transparent',
              }}
            >
              <span className="text-sm font-display font-semibold" style={{ color: 'var(--color-text)' }}>
                {i + 1}. {lesson.title}
              </span>
            </button>
          ))}
        </div>

        <div
          className="md:col-span-2 rounded-2xl border p-6"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          {activeLesson && (
            <>
              <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                {activeLesson.title}
              </h2>

             {activeLesson.video_type === 'youtube' && activeLesson.video_url && (
                <div className="mb-4 rounded-lg overflow-hidden aspect-video">
                  <iframe
                    src={getEmbedUrl(activeLesson.video_url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    title={activeLesson.title}
                  />
                </div>
              )}

              {activeLesson.video_type === 'upload' && (
                <div className="mb-4 rounded-lg overflow-hidden aspect-video" style={{ backgroundColor: 'var(--color-bg)' }}>
                  {videoLoading && (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--color-text-muted)' }}>
                      Loading video...
                    </div>
                  )}
                  {!videoLoading && videoBlobUrl && (
                    <video controls controlsList="nodownload" className="w-full h-full" src={videoBlobUrl}>
                      Your browser doesn't support video playback.
                    </video>
                  )}
                  {!videoLoading && !videoBlobUrl && (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--color-text-muted)' }}>
                      Video unavailable.
                    </div>
                  )}
                </div>
              )}

              <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {activeLesson.content}
              </p>

              <button
                onClick={() => markComplete(activeLesson.id)}
                className="px-6 py-2.5 rounded-full font-display font-semibold text-white mb-8"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Mark as complete
              </button>

              {quiz && (
                <div className="border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
                  <h3 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                    Quiz: {quiz.title}
                  </h3>

                  {!quizResult ? (
                    <>
                      {quiz.questions?.map((q) => (
                        <div key={q.id} className="mb-4">
                          <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>{q.question}</p>
                          <div className="space-y-2">
                            {q.options?.map((opt, idx) => (
                              <label key={idx} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q-${q.id}`}
                                  value={opt}
                                  checked={quizAnswers[q.id] === opt}
                                  onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt })}
                                />
                                <span style={{ color: 'var(--color-text-muted)' }}>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={submitQuiz}
                        className="px-6 py-2.5 rounded-full font-display font-semibold text-white mt-2"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        Submit quiz
                      </button>
                    </>
                  ) : (
                    <div
                      className="rounded-xl p-4"
                      style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                    >
                      <p className="font-display text-lg font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                        Score: {quizResult.score}%
                      </p>
                      <p style={{ color: 'var(--color-text-muted)' }}>
                        {quizResult.correct_answers} / {quizResult.total_questions} correct
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
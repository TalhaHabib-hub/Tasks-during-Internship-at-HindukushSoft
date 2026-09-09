import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: 0, category_id: '' });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState('');

const loadCourses = () => {
    api.get('/instructor/stats').then((res) => {
      setCourses(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadCourses();
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category_id', form.category_id);
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      await api.post('/instructor/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm({ title: '', description: '', price: 0, category_id: '' });
      setThumbnailFile(null);
      setShowForm(false);
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : 'Failed to create course');
    }
  };

  const statusColors = {
    pending: '#EAB308',
    approved: '#22C55E',
    rejected: '#EF4444',
  };

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Instructor Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your courses.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 rounded-full font-display font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {showForm ? 'Cancel' : '+ New course'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border p-6 mb-10 space-y-4"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          {error && <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>}

          <input
            name="title" placeholder="Course title" value={form.title} onChange={handleChange} required
            className="w-full px-4 py-2.5 rounded-lg border outline-none"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
          />
          <textarea
            name="description" placeholder="Description" value={form.description} onChange={handleChange} required rows={3}
            className="w-full px-4 py-2.5 rounded-lg border outline-none"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              name="category_id" value={form.category_id} onChange={handleChange} required
              className="px-4 py-2.5 rounded-lg border outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
            >
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input
              type="number" name="price" placeholder="Price (0 = free)" value={form.price} onChange={handleChange} min="0" step="0.01"
              className="px-4 py-2.5 rounded-lg border outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
              Thumbnail (optional)
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
              className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Leave empty to use a default colored card instead.
            </p>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full font-display font-semibold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Create course
          </button>
        </form>
      )}

      {loading && <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>}

      <div className="space-y-4">
        {courses.map((course) => (
          <Link
            to={`/instructor/courses/${course.id}`}
            key={course.id}
            className="flex items-center justify-between rounded-2xl border p-5"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <div>
              <h3 className="font-display text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                {course.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {course.category?.name} · {course.price == 0 ? 'Free' : `$${course.price}`} · {course.enrollments_count} {course.enrollments_count === 1 ? 'student' : 'students'}
              </p>
            </div>
            <span
              className="text-xs font-display font-semibold px-3 py-1 rounded-full capitalize"
              style={{ backgroundColor: 'var(--color-bg)', color: statusColors[course.status] }}
            >
              {course.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
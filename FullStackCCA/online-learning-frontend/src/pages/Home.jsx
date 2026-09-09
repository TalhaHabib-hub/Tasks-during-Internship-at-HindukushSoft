import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = search ? { search } : {};
    api.get('/courses', { params }).then((res) => setCourses(res.data)).finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
          Learn something new today
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          Courses built by instructors, ready when you are.
        </p>
      </div>

      <div className="mb-10 max-w-md">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-full border outline-none"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
        />
      </div>

      {loading && <p style={{ color: 'var(--color-text-muted)' }}>Loading courses...</p>}

      {!loading && courses.length === 0 && (
        <div className="rounded-2xl border px-8 py-16 text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <p className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            {search ? 'No matching courses' : 'No courses yet'}
          </p>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {search ? 'Try a different search term.' : 'Check back soon, or become an instructor to add the first one.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            to={`/courses/${course.id}`}
            key={course.id}
            className="group rounded-2xl border overflow-hidden transition-transform hover:-translate-y-1"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <div
              className="h-36 flex items-center justify-center font-display text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, transparent 150%)', color: 'var(--color-bg)' }}
            >
              {course.category?.name || 'Course'}
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold mb-2 leading-snug" style={{ color: 'var(--color-text)' }}>
                {course.title}
              </h3>
              <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                {course.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--color-text-muted)' }}>{course.instructor?.name}</span>
                <span className="font-display font-bold" style={{ color: 'var(--color-primary)' }}>
                  {course.price == 0 ? 'Free' : `$${course.price}`}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
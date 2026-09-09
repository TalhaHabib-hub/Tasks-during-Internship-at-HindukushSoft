import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/enrollments').then(async (res) => {
      setEnrollments(res.data);

      const progressResults = await Promise.all(
        res.data.map((e) => api.get(`/enrollments/${e.id}/progress`).then((r) => [e.id, r.data]))
      );
      setProgressMap(Object.fromEntries(progressResults));
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <h1 className="font-display text-4xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
        My Learning
      </h1>
      <p className="text-lg mb-12" style={{ color: 'var(--color-text-muted)' }}>
        Courses you're enrolled in.
      </p>

      {loading && <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>}

      {!loading && enrollments.length === 0 && (
        <div
          className="rounded-2xl border px-8 py-16 text-center"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          <p className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            No courses yet
          </p>
          <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Browse the catalog and enroll in something new.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 rounded-full font-display font-semibold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Browse courses
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((e) => {
          const progress = progressMap[e.id];
          return (
            <Link
              to={`/learn/${e.course_id}`}
              key={e.id}
              className="rounded-2xl border p-5 transition-transform hover:-translate-y-1"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            >
              <h3 className="font-display text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                {e.course?.title}
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                {e.status === 'completed' ? 'Completed' : 'In progress'}
              </p>

              <div className="w-full h-2 rounded-full mb-2" style={{ backgroundColor: 'var(--color-border)' }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${progress?.percentage || 0}%`,
                    backgroundColor: 'var(--color-primary)',
                  }}
                />
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {progress?.completed_lessons || 0} / {progress?.total_lessons || 0} lessons · {progress?.percentage || 0}%
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
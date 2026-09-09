import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const heroImages = [
  'https://images.pexels.com/photos/33782646/pexels-photo-33782646.jpeg?auto=compress&w=800',
  'https://images.pexels.com/photos/18699972/pexels-photo-18699972.jpeg?auto=compress&w=800',
  'https://images.pexels.com/photos/36044000/pexels-photo-36044000.jpeg?auto=compress&w=800',
  'https://images.pexels.com/photos/8199172/pexels-photo-8199172.jpeg?auto=compress&w=800',
  'https://images.pexels.com/photos/5324824/pexels-photo-5324824.jpeg?auto=compress&w=800',
];

function HeroImageCarousel() {
  const [index, setIndex] = useState(0);
  const duration = 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, duration);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-sm">
        <div
          className="absolute inset-0 rounded-3xl"
          style={{ backgroundColor: 'var(--color-primary)', transform: 'rotate(-4deg)' }}
        />
        <div className="relative w-full h-96 rounded-3xl border-4 overflow-hidden" style={{ borderColor: 'var(--color-bg)' }}>
          {heroImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Smiling student"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: i === index ? 1 : 0,
                transform: i === index ? 'scale(1.08)' : 'scale(1)',
                objectPosition: '50% 20%',
                transition: 'opacity 1.6s ease-in-out, transform 6s ease-out',
              }}
            />
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {heroImages.map((_, i) => (
            <div
              key={i}
              className="relative h-1.5 rounded-full overflow-hidden"
              style={{
                width: i === index ? '32px' : '8px',
                backgroundColor: 'var(--color-border)',
                transition: 'width 0.5s ease',
              }}
            >
              {i === index && (
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    animation: `dotFill ${duration}ms linear forwards`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
      <style>{`
        @keyframes dotFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-title { animation: heroFadeUp 0.9s ease-out both; }
        .hero-subtitle { animation: heroFadeUp 0.9s ease-out 0.15s both; }
        .hero-quote { animation: heroFadeUp 0.9s ease-out 0.3s both; }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h1 className="hero-title font-display text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: 'var(--color-text)' }}>
            Chitral Coaching Academy
          </h1>
          <p className="hero-subtitle text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>
            Courses built by instructors, ready when you are.
          </p>

          <div
            className="hero-quote rounded-2xl border-l-4 p-5"
            style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-surface)' }}
          >
            <p className="font-display text-lg italic leading-relaxed mb-2" style={{ color: 'var(--color-text)' }}>
              "The beautiful thing about learning is that no one can take it away from you."
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
              — B.B. King
            </p>
          </div>
        </div>

        <HeroImageCarousel />
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
            {course.thumbnail_url ? (
              <div
                className="h-36 bg-cover bg-center"
                style={{ backgroundImage: `url(${course.thumbnail_url})` }}
              />
            ) : (
              <div
                className="h-36 flex items-center justify-center font-display text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, transparent 150%)', color: 'var(--color-bg)' }}
              >
                {course.category?.name || 'Course'}
              </div>
            )}
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
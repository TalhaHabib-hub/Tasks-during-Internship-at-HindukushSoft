import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '', role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message || 'Registration failed');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12">
      <div
        className="w-full max-w-md rounded-2xl border p-8"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Create your account
        </h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Start teaching or learning today.
        </p>

        {error && (
          <div
            className="mb-6 rounded-lg px-4 py-3 text-sm"
            style={{ backgroundColor: 'color-mix(in srgb, red 15%, transparent)', color: '#EF4444' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full px-4 py-2.5 rounded-lg border outline-none" style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full px-4 py-2.5 rounded-lg border outline-none" style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required
              className="w-full px-4 py-2.5 rounded-lg border outline-none" style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Confirm password</label>
            <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required
              className="w-full px-4 py-2.5 rounded-lg border outline-none" style={inputStyle} />
          </div>

          

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full font-display font-semibold text-white transition-colors disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
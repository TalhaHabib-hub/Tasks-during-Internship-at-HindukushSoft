import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetails from './pages/CourseDetails';
import MyCourses from './pages/MyCourses';
import LessonViewer from './pages/LessonViewer';
import InstructorDashboard from './pages/InstructorDashboard';
import ManageCourse from './pages/ManageCourse';
import AdminDashboard from './pages/AdminDashboard';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-8 w-14 items-center rounded-full border transition-colors cursor-pointer"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      aria-label="Toggle theme"
    >
      <span
        className="absolute h-6 w-6 rounded-full transition-transform flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-primary)',
          transform: theme === 'dark' ? 'translateX(28px)' : 'translateX(4px)',
        }}
      >
        {theme === 'dark' ? <Moon size={14} color="white" /> : <Sun size={14} color="white" />}
      </span>
    </button>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = (
    <>
      <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: 'var(--color-text-muted)' }} className="hover:opacity-70 transition-opacity">
        Courses
      </Link>
      {user?.role === 'instructor' && (
        <Link to="/instructor" onClick={() => setMenuOpen(false)} style={{ color: 'var(--color-text-muted)' }} className="hover:opacity-70 transition-opacity">
          Dashboard
        </Link>
      )}
      {user?.role === 'admin' && (
        <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ color: 'var(--color-text-muted)' }} className="hover:opacity-70 transition-opacity">
          Admin
        </Link>
      )}
      {user?.role === 'student' && (
        <Link to="/my-courses" onClick={() => setMenuOpen(false)} style={{ color: 'var(--color-text-muted)' }} className="hover:opacity-70 transition-opacity">
          My Learning
        </Link>
      )}
    </>
  );

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 85%, transparent)' }}
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
          CCA<span style={{ color: 'var(--color-primary)' }}>.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-display text-sm font-medium">
          {navLinks}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-4">
            {!user && (
              <>
                <Link to="/login" className="font-display text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="font-display text-sm font-semibold px-4 py-2 rounded-full text-white transition-colors"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Get started
                </Link>
              </>
            )}
            {user && (
              <>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="font-display text-sm font-semibold px-4 py-2 rounded-full border transition-colors"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Log out
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <Menu size={22} color="var(--color-text)" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden flex flex-col gap-4 px-6 py-6 border-t font-display text-sm font-medium"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {navLinks}
          <div className="pt-4 border-t flex flex-col gap-3" style={{ borderColor: 'var(--color-border)' }}>
            {!user && (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: 'var(--color-text)' }}>
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-full text-white text-center"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Get started
                </Link>
              </>
            )}
            {user && (
              <>
                <span style={{ color: 'var(--color-text-muted)' }}>{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full border text-center"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/learn/:courseId" element={<LessonViewer />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/instructor/courses/:id" element={<ManageCourse />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
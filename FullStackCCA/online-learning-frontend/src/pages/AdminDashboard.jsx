import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [tab, setTab] = useState('courses');
  const [allCourses, setAllCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const loadAll = () => {
    api.get('/admin/courses').then((res) => setAllCourses(res.data));
    api.get('/admin/users').then((res) => setUsers(res.data));
    api.get('/categories').then((res) => setCategories(res.data));
  };

  useEffect(() => { loadAll(); }, []);

  const approveCourse = async (id) => {
    const res = await api.put(`/admin/courses/${id}/approve`);
    setAllCourses((prev) => prev.map((c) => (c.id === id ? res.data : c)));
  };

  const rejectCourse = async (id) => {
    const res = await api.put(`/admin/courses/${id}/reject`);
    setAllCourses((prev) => prev.map((c) => (c.id === id ? res.data : c)));
  };

const changeRole = async (id, role) => {
    const res = await api.put(`/admin/users/${id}/role`, { role });
    setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)));
  };

  const toggleBlock = async (id) => {
    const res = await api.put(`/admin/users/${id}/block`);
    setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)));
  };

  const deleteUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const res = await api.post('/admin/categories', { name: newCategory });
    setCategories((prev) => [...prev, res.data]);
    setNewCategory('');
  };

  const deleteCategory = async (id) => {
    await api.delete(`/admin/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const tabs = [
    { key: 'courses', label: 'Courses' },
    { key: 'users', label: 'Users' },
    { key: 'categories', label: 'Categories' },
  ];

  const inputStyle = {
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
  };

  const statusColors = { pending: '#EAB308', approved: '#22C55E', rejected: '#EF4444' };

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
      <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
        Admin Dashboard
      </h1>
      <p className="mb-10" style={{ color: 'var(--color-text-muted)' }}>
        Manage courses, users, and categories.
      </p>

      <div className="flex gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-5 py-2 rounded-full font-display text-sm font-semibold transition-colors"
            style={{
              backgroundColor: tab === t.key ? 'var(--color-primary)' : 'var(--color-surface)',
              color: tab === t.key ? 'white' : 'var(--color-text)',
              border: '1px solid var(--color-border)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'courses' && (
        <div className="space-y-3">
          {allCourses.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{c.title}</p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  By {c.instructor?.name} · {c.category?.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-display font-semibold px-3 py-1 rounded-full capitalize" style={{ backgroundColor: 'var(--color-bg)', color: statusColors[c.status] }}>
                  {c.status}
                </span>
                {c.status !== 'approved' && (
                  <button onClick={() => approveCourse(c.id)} className="text-sm font-medium" style={{ color: '#22C55E' }}>Approve</button>
                )}
                {c.status !== 'rejected' && (
                  <button onClick={() => rejectCourse(c.id)} className="text-sm font-medium" style={{ color: '#EF4444' }}>Reject</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

     {tab === 'users' && (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{u.name} <span className="text-xs font-normal capitalize" style={{ color: 'var(--color-text-muted)' }}>· {u.role}</span></p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  className="text-sm px-3 py-1.5 rounded-lg border capitalize"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
                <span
                  className="text-xs font-display font-semibold px-3 py-1 rounded-full capitalize"
                  style={{ backgroundColor: 'var(--color-bg)', color: u.status === 'active' ? '#22C55E' : '#EF4444' }}
                >
                  {u.status}
                </span>
                <button onClick={() => toggleBlock(u.id)} className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                  {u.status === 'active' ? 'Block' : 'Unblock'}
                </button>
                <button onClick={() => deleteUser(u.id)} className="text-sm font-medium" style={{ color: '#EF4444' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'categories' && (
        <div>
          <form onSubmit={addCategory} className="flex gap-3 mb-6">
            <input placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="flex-1 px-4 py-2.5 rounded-lg border outline-none" style={inputStyle} />
            <button type="submit" className="px-6 py-2.5 rounded-full font-display font-semibold text-white" style={{ backgroundColor: 'var(--color-primary)' }}>Add</button>
          </form>
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <span style={{ color: 'var(--color-text)' }}>{c.name}</span>
                <button onClick={() => deleteCategory(c.id)} className="text-sm font-medium" style={{ color: '#EF4444' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
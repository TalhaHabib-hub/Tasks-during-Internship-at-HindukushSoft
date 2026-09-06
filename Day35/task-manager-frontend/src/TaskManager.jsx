import { useState, useEffect } from 'react';
import api from './api/axios';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      setGeneralError('Could not load tasks. Please refresh.');
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');
    setLoading(true);

    try {
      await api.post('/tasks', { title });
      setTitle('');
      fetchTasks();
    } catch (err) {
      if (err.response?.status === 422) {
        // Laravel validation errors come as { errors: { title: [...] } }
        setFieldErrors(err.response.data.errors);
      } else {
        setGeneralError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div className="container">
      <h1>My Tasks</h1>

      {generalError && <div className="alert-error">{generalError}</div>}

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
        {fieldErrors.title && (
          <p className="field-error">{fieldErrors.title[0]}</p>
        )}
        <button disabled={loading}>{loading ? 'Adding...' : 'Add Task'}</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
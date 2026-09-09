import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => setForm(res.data));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/posts/${id}`, form);
    navigate('/');
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} required /><br /><br />
        <input name="author" value={form.author} onChange={handleChange} required /><br /><br />
        <input name="category" value={form.category} onChange={handleChange} required /><br /><br />
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Published</option>
          <option>Draft</option>
          <option>Archived</option>
        </select><br /><br />
        <textarea name="content" value={form.content} onChange={handleChange} required /><br /><br />
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

export default EditPost;
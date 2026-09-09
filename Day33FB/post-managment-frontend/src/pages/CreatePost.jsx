import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', author: '', category: 'Design', status: 'Published', content: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/posts', form);
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-light text-gray-800 mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Title</label>
            <input name="title" onChange={handleChange} required
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-blue-500" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Author</label>
            <input name="author" onChange={handleChange} required
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-blue-500" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Category</label>
            <input name="category" value={form.category} onChange={handleChange} required
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-blue-500" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-blue-500">
              <option>Published</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Content</label>
          <textarea name="content" onChange={handleChange} required rows={6}
            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-blue-500" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => navigate('/')}
            className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm">Cancel</button>
          <button type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Create Post</button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
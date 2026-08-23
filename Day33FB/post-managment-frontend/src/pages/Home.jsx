import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusStyles = {
  Published: 'bg-green-100 text-green-700',
  Draft: 'bg-red-100 text-red-700',
  Archived: 'bg-yellow-100 text-yellow-700',
};

function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await api.get('/posts');
    setPosts(res.data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    fetchPosts();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-4xl font-light text-center text-gray-800">Post Management System</h1>
      <p className="text-center text-gray-500 mt-1">Manage your posts efficiently</p>

      <div className="bg-white rounded-lg shadow mt-8 overflow-hidden border border-gray-200">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-700">All Posts</h3>
          <Link to="/create-post">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
              + Create New
            </button>
          </Link>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Author</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => (
              <tr key={post.id} className={i % 2 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3 text-blue-600 underline cursor-pointer">{post.title}</td>
                <td className="px-4 py-3">{post.author}</td>
                <td className="px-4 py-3">{post.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[post.status]}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(post.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 space-x-2">
                  <Link to={`/edit-post/${post.id}`}>
                    <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
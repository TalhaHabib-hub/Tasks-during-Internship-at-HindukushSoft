import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    api.get("/posts").then((res) => {
      setPosts(res.data);
      setLoading(false);
    });
  }, []);

  async function savePost(e) {
    e.preventDefault();
    if (draft.id) {
      const res = await api.put(`/posts/${draft.id}`, {
        title: draft.title,
        body: draft.body,
      });
      setPosts((prev) => prev.map((p) => (p.id === draft.id ? res.data : p)));
    } else {
      const res = await api.post("/posts", {
        title: draft.title,
        body: draft.body,
      });
      setPosts((prev) => [res.data, ...prev]);
    }
    setDraft(null);
  }

  async function deletePost(id) {
    await api.delete(`/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <p>Loading posts...</p>;

  return (
    <div className="dashboard">
      <header>
        <h1>{user.name}'s posts</h1>
        <button onClick={logout}>Sign out</button>
      </header>

      <button onClick={() => setDraft({ title: "", body: "" })}>
        New post
      </button>

      {draft && (
        <form onSubmit={savePost} className="post-form">
          <input
            type="text"
            placeholder="Title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Body"
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            required
          />
          <div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="post-list">
        {posts.length === 0 && <p>No posts yet.</p>}
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <div>
              <button onClick={() => setDraft(post)}>Edit</button>
              <button onClick={() => deletePost(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
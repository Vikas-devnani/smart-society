import React, { useState, useEffect } from "react";
import { api } from "../api";

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  const load = () => api.getNotices().then(setNotices);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.addNotice(form);
    setForm({ title: "", content: "" });
    await load();
    setLoading(false);
  };

  return (
    <div>
      <div className="page-title">Notice Board</div>
      <div className="page-sub">SOCIETY ANNOUNCEMENTS + CIRCULARS</div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Post Notice</div>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Water supply shutdown on Sunday" required />
            </div>
            <div className="form-group">
              <label>Content *</label>
              <textarea rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Dear residents, please note that..." required />
            </div>
            <button className="btn" type="submit" disabled={loading}>{loading ? "Posting..." : "Post Notice"}</button>
          </form>
        </div>
        <div>
          <div style={{ marginBottom: 10, color: "var(--text3)", fontSize: 11, letterSpacing: "0.1em" }}>NOTICES ({notices.length})</div>
          {notices.length === 0 ? <div className="empty">No notices posted</div> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {notices.map(n => (
                <div className="notice-card" key={n.id}>
                  <div style={{ flex: 1 }}>
                    <div className="notice-title">{n.title}</div>
                    <div className="notice-content">{n.content}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                    <div className="notice-date">{new Date(n.created_at).toLocaleDateString()}</div>
                    <button className="btn btn-danger btn-sm" onClick={() => api.deleteNotice(n.id).then(load)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
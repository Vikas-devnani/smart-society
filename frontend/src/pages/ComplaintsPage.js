import React, { useState, useEffect } from "react";
import { api } from "../api";

const PRIORITY_MAP = { critical: "badge-critical", high: "badge-high", medium: "badge-medium", low: "badge-low" };

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", flat_number: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const load = async () => {
    setFetching(true);
    const data = await api.getComplaints();
    setComplaints(data);
    setFetching(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setLoading(true);
    setResult(null);
    const r = await api.submitComplaint(form);
    setResult(r);
    setForm({ title: "", description: "", flat_number: "" });
    await load();
    setLoading(false);
  };

  return (
    <div>
      <div className="page-title">Complaint Management</div>
      <div className="page-sub">AI-POWERED CLASSIFICATION + AGENT RESPONSE</div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Submit Complaint</div>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Flat Number</label>
              <input value={form.flat_number} onChange={e => setForm({ ...form, flat_number: e.target.value })} placeholder="A-101" />
            </div>
            <div className="form-group">
              <label>Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Water leakage in bathroom" required />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail..." required />
            </div>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit + Classify"}
            </button>
          </form>

          {loading && <div className="loading" style={{ marginTop: 12 }}><div className="spinner" /> AI classifying complaint...</div>}

          {result && (
            <div className="response-box">
              <strong>Classification:</strong> {result.classification?.category} | {result.classification?.priority}<br />
              <strong>Agent:</strong> {result.agent_response}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Recent Complaints ({complaints.length})</div>
          {fetching ? (
            <div className="loading"><div className="spinner" /> Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="empty">No complaints yet</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Flat</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(c => (
                    <tr key={c.id}>
                      <td>{c.flat_number || "—"}</td>
                      <td>{c.title}</td>
                      <td>{c.category}</td>
                      <td><span className={`badge ${PRIORITY_MAP[c.priority] || "badge-low"}`}>{c.priority}</span></td>
                      <td className={`status-${c.status}`}>{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

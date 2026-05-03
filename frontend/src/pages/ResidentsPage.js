import React, { useState, useEffect } from "react";
import { api } from "../api";

export default function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [form, setForm] = useState({ name: "", flat_number: "", role: "resident", contact: "" });
  const [loading, setLoading] = useState(false);

  const load = () => api.getResidents().then(setResidents);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.addResident(form);
    setForm({ name: "", flat_number: "", role: "resident", contact: "" });
    await load();
    setLoading(false);
  };

  return (
    <div>
      <div className="page-title">Residents</div>
      <div className="page-sub">FLAT DIRECTORY + RESIDENT MANAGEMENT</div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Add Resident</div>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" required />
            </div>
            <div className="form-group">
              <label>Flat Number *</label>
              <input value={form.flat_number} onChange={e => setForm({ ...form, flat_number: e.target.value })} placeholder="A-101" required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="resident">Resident</option>
                <option value="owner">Owner</option>
                <option value="tenant">Tenant</option>
                <option value="committee">Committee</option>
              </select>
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="+91 9876543210" />
            </div>
            <button className="btn" type="submit" disabled={loading}>{loading ? "Adding..." : "Add Resident"}</button>
          </form>
        </div>
        <div className="card">
          <div className="card-title">Residents ({residents.length})</div>
          {residents.length === 0 ? <div className="empty">No residents added</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Flat</th><th>Name</th><th>Role</th><th>Contact</th><th></th></tr></thead>
                <tbody>
                  {residents.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.flat_number}</strong></td>
                      <td>{r.name}</td>
                      <td><span className="badge badge-low">{r.role}</span></td>
                      <td style={{ color: "var(--text2)" }}>{r.contact || "—"}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => api.deleteResident(r.id).then(load)}>✕</button></td>
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
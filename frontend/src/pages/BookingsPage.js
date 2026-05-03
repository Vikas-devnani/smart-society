import React, { useState, useEffect } from "react";
import { api } from "../api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [form, setForm] = useState({ flat_number: "", facility: "", date: "" });
  const [loading, setLoading] = useState(false);

  const load = () => api.getBookings().then(d => setBookings(Array.isArray(d) ? d : []));

  useEffect(() => {
    load();
    api.getFacilities().then(f => {
      setFacilities(f);
      setForm(fm => ({ ...fm, facility: f[0] || "" }));
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.addBooking(form);
    setForm({ flat_number: "", facility: form.facility, date: "" });
    await load();
    setLoading(false);
  };

  const statusColor = { pending: "badge-pending", approved: "badge-low", rejected: "badge-critical" };

  return (
    <div>
      <div className="page-title">Facility Booking</div>
      <div className="page-sub">CLUBHOUSE · GYM · POOL · COURTS</div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">New Booking</div>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Flat Number *</label>
              <input value={form.flat_number} onChange={e => setForm({ ...form, flat_number: e.target.value })} placeholder="A-101" required />
            </div>
            <div className="form-group">
              <label>Facility *</label>
              <select value={form.facility} onChange={e => setForm({ ...form, facility: e.target.value })}>
                {facilities.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            </div>
            <button className="btn" type="submit" disabled={loading}>{loading ? "Booking..." : "Request Booking"}</button>
          </form>
        </div>
        <div className="card">
          <div className="card-title">Bookings ({bookings.length})</div>
          {bookings.length === 0 ? <div className="empty">No bookings yet</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Flat</th><th>Facility</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.flat_number}</strong></td>
                      <td>{b.facility}</td>
                      <td style={{ color: "var(--text2)", fontSize: 12 }}>{b.date}</td>
                      <td><span className={`badge ${statusColor[b.status] || "badge-pending"}`}>{b.status}</span></td>
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
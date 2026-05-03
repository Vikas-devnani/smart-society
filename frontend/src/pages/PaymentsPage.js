import React, { useState, useEffect } from "react";
import { api } from "../api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ flat_number: "", amount: "", status: "pending", due_date: "" });
  const [loading, setLoading] = useState(false);

  const load = () => api.getPayments().then(setPayments);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.addPayment({ ...form, amount: parseFloat(form.amount) });
    setForm({ flat_number: "", amount: "", status: "pending", due_date: "" });
    await load();
    setLoading(false);
  };

  const pending = payments.filter(p => p.status === "pending");
  const totalDue = pending.reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <div className="page-title">Payments</div>
      <div className="page-sub">MAINTENANCE DUES + PAYMENT TRACKING</div>
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Records</div>
          <div className="stat-value stat-info">{payments.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value stat-warn">{pending.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Amount Due</div>
          <div className="stat-value stat-accent">₹{totalDue.toLocaleString()}</div>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Add Payment Record</div>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Flat Number *</label>
              <input value={form.flat_number} onChange={e => setForm({ ...form, flat_number: e.target.value })} placeholder="A-101" required />
            </div>
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="2500" required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
            </div>
            <button className="btn" type="submit" disabled={loading}>{loading ? "Adding..." : "Add Record"}</button>
          </form>
        </div>
        <div className="card">
          <div className="card-title">Payment Records</div>
          {payments.length === 0 ? <div className="empty">No payment records</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Flat</th><th>Amount</th><th>Due Date</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.flat_number}</strong></td>
                      <td>₹{p.amount.toLocaleString()}</td>
                      <td style={{ color: "var(--text2)", fontSize: 12 }}>{p.due_date || "—"}</td>
                      <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                      <td>{p.status !== "paid" && <button className="btn btn-sm" onClick={() => api.updatePaymentStatus(p.id, "paid").then(load)}>Mark Paid</button>}</td>
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
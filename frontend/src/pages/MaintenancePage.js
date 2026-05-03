import React, { useState, useEffect } from "react";
import { api } from "../api";

const RISK_MAP = { critical: "badge-critical", high: "badge-high", medium: "badge-medium", low: "badge-low" };

const EQUIPMENT_OPTIONS = ["Elevator", "Water Pump", "Generator", "CCTV", "Lights", "Pipe", "Gate", "Intercom", "Fire System"];

export default function MaintenancePage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ equipment: "", issue: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await api.getMaintenance();
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.equipment || !form.issue) return;
    setLoading(true);
    setResult(null);
    const r = await api.submitMaintenance(form);
    setResult(r);
    setForm({ equipment: "", issue: "" });
    await load();
    setLoading(false);
  };

  return (
    <div>
      <div className="page-title">Predictive Maintenance</div>
      <div className="page-sub">RULE-BASED RISK ASSESSMENT + AI ACTION PLANNING</div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Report Equipment Issue</div>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Equipment *</label>
              <select value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })} required>
                <option value="">Select equipment</option>
                {EQUIPMENT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Issue Description *</label>
              <textarea rows={4} value={form.issue} onChange={e => setForm({ ...form, issue: e.target.value })}
                placeholder="Describe the issue: noise, leak, failure..." required />
            </div>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Analyze Risk"}
            </button>
          </form>

          {loading && <div className="loading" style={{ marginTop: 12 }}><div className="spinner" /> Running predictive analysis...</div>}

          {result && (
            <div className="response-box">
              <strong>Equipment:</strong> {result.equipment}<br />
              <strong>Risk Level:</strong> <span className={`badge ${RISK_MAP[result.risk_level]}`}>{result.risk_level}</span><br />
              <strong>Action Plan:</strong> {result.action}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Maintenance Log ({items.length})</div>
          {items.length === 0 ? (
            <div className="empty">No maintenance records</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Issue</th>
                    <th>Risk</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(m => (
                    <tr key={m.id}>
                      <td>{m.equipment}</td>
                      <td style={{ maxWidth: 200 }}>{m.issue}</td>
                      <td><span className={`badge ${RISK_MAP[m.risk_level] || "badge-low"}`}>{m.risk_level}</span></td>
                      <td style={{ color: "var(--text3)", fontSize: 11 }}>{new Date(m.created_at).toLocaleDateString()}</td>
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

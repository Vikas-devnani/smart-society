import React, { useState, useEffect } from "react";
import { api } from "../api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getInsights()
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <div className="loading" style={{ marginTop: 40 }}><div className="spinner" /> Loading insights...</div>;
  if (error) return <div className="empty">Backend error: {error} — make sure backend is running on port 8000</div>;
  if (!data || !data.complaints) return <div className="empty">No data available</div>;

  const maxCat = data.complaints.by_category[0]?.cnt || 1;

  return (
    <div>
      <div className="page-title">Dashboard</div>
      <div className="page-sub">REAL-TIME SOCIETY OVERVIEW</div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Complaints</div>
          <div className="stat-value stat-accent">{data.complaints.total}</div>
          <div className="stat-sub">{data.complaints.open} open · {data.complaints.resolved} resolved</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Residents</div>
          <div className="stat-value stat-info">{data.residents.total}</div>
          <div className="stat-sub">registered flats</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Dues</div>
          <div className="stat-value stat-warn">{data.payments.pending_count}</div>
          <div className="stat-sub">₹{data.payments.pending_amount.toLocaleString()} outstanding</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">High Risk Maintenance</div>
          <div className="stat-value" style={{ color: data.maintenance.high_risk_count > 0 ? "var(--critical)" : "var(--low)" }}>
            {data.maintenance.high_risk_count}
          </div>
          <div className="stat-sub">critical + high issues</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Complaints by Category</div>
          {data.complaints.by_category.length === 0 ? (
            <div className="empty">No complaints yet</div>
          ) : (
            data.complaints.by_category.map(c => (
              <div className="bar-row" key={c.category}>
                <div className="bar-label">{c.category}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(c.cnt / maxCat) * 100}%` }} />
                </div>
                <div className="bar-count">{c.cnt}</div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-title">Priority Breakdown</div>
          {data.complaints.by_priority.length === 0 ? (
            <div className="empty">No data yet</div>
          ) : (
            data.complaints.by_priority.map(p => {
              const cls = { critical: "badge-critical", high: "badge-high", medium: "badge-medium", low: "badge-low" }[p.priority] || "badge-low";
              return (
                <div key={p.priority} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span className={`badge ${cls}`}>{p.priority}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>{p.cnt}</span>
                </div>
              );
            })
          )}
          {data.recent_notices.length > 0 && (
            <>
              <div className="card-title" style={{ marginTop: 20 }}>Recent Notices</div>
              {data.recent_notices.map((n, i) => (
                <div key={i} style={{ fontSize: 12, color: "var(--text2)", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  {n.title}
                  <span style={{ color: "var(--text3)", marginLeft: 8, fontSize: 10 }}>{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
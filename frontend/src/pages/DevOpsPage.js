import React, { useState, useEffect } from "react";
import { api } from "../api";

const ACTIONS = ["status", "health", "logs", "restart"];

export default function DevOpsPage() {
  const [sysStatus, setSysStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStatus = async () => {
    const s = await api.getDeployStatus();
    setSysStatus(s);
  };

  useEffect(() => { loadStatus(); }, []);

  const runAction = async (action) => {
    setLoading(true);
    const r = await api.deployAction(action);
    setLogs(l => [{ time: new Date().toLocaleTimeString(), action, ...r }, ...l.slice(0, 19)]);
    setLoading(false);
  };

  return (
    <div>
      <div className="page-title">DevOps Control</div>
      <div className="page-sub">SYSTEM MONITORING + AGENT-DRIVEN OPERATIONS</div>

      {sysStatus && (
        <div className="status-grid">
          {Object.entries(sysStatus).map(([k, v]) => (
            <div className="status-item" key={k}>
              <div className="status-dot" />
              <div className="status-name">{k}</div>
              <div className="status-val">{v}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {ACTIONS.map(a => (
              <button key={a} className="btn btn-outline" style={{ textTransform: "capitalize" }}
                onClick={() => runAction(a)} disabled={loading}>
                ⬡ {a}
              </button>
            ))}
          </div>
          {loading && <div className="loading" style={{ marginTop: 12 }}><div className="spinner" /> DevOps agent executing...</div>}
        </div>

        <div className="card">
          <div className="card-title">Action Log</div>
          {logs.length === 0 ? (
            <div className="empty">No actions run yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto" }}>
              {logs.map((l, i) => (
                <div key={i} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "var(--accent2)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>{l.action}</span>
                    <span style={{ color: "var(--text3)", fontSize: 11 }}>{l.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{l.analysis || l.cmd_output}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

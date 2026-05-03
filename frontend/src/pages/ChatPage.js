import React, { useState, useRef, useEffect } from "react";
import { api } from "../api";

const SUGGESTIONS = [
  "How many open complaints are there?",
  "What are the high priority issues?",
  "Summarize maintenance status",
  "Which category has most complaints?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your AI Society Assistant. Ask me about complaints, maintenance, or system status." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (msg) => {
    const text = msg || input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    const r = await api.sendChat(text);
    setMessages(m => [...m, { role: "ai", text: r.response || "No response" }]);
    setLoading(false);
  };

  return (
    <div>
      <div className="page-title">AI Chat Assistant</div>
      <div className="page-sub">QUERY YOUR SOCIETY DATABASE WITH NATURAL LANGUAGE</div>

      <div className="grid-2">
        <div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg msg-${m.role}`}>
                <div className="msg-label">{m.role === "user" ? "You" : "AI Assistant"}</div>
                <div className="msg-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="msg msg-ai">
                <div className="msg-label">AI Assistant</div>
                <div className="msg-bubble"><div className="loading"><div className="spinner" /> Thinking...</div></div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="chat-input-row">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask about society status..."
              disabled={loading}
            />
            <button className="btn" onClick={() => send()} disabled={loading || !input.trim()}>Send</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Suggested Queries</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="btn btn-outline" style={{ textAlign: "left", textTransform: "none", letterSpacing: 0 }}
                onClick={() => send(s)} disabled={loading}>
                {s}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <div className="card-title">Capabilities</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, color: "var(--text2)", fontSize: 12 }}>
              <div>◈ Query complaint statistics</div>
              <div>◈ Check maintenance risk levels</div>
              <div>◈ Get category breakdowns</div>
              <div>◈ System health summaries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import ChatPage from "./pages/ChatPage";
import MaintenancePage from "./pages/MaintenancePage";
import DevOpsPage from "./pages/DevOpsPage";
import ResidentsPage from "./pages/ResidentsPage";
import PaymentsPage from "./pages/PaymentsPage";
import NoticesPage from "./pages/NoticesPage";
import BookingsPage from "./pages/BookingsPage";
import "./App.css";

const NAV = [
  { id: "dashboard",   icon: "◈", label: "Dashboard" },
  { id: "residents",   icon: "⊙", label: "Residents" },
  { id: "payments",    icon: "◎", label: "Payments" },
  { id: "complaints",  icon: "⚠", label: "Complaints" },
  { id: "notices",     icon: "◉", label: "Notices" },
  { id: "bookings",    icon: "⊞", label: "Bookings" },
  { id: "chat",        icon: "◈", label: "AI Chat" },
  { id: "maintenance", icon: "⚙", label: "Maintenance" },
  { id: "devops",      icon: "⬡", label: "DevOps" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-logo">
          <span className="logo-mark">◉</span>
          {!collapsed && (
            <div>
              <div className="logo-title">SMART</div>
              <div className="logo-sub">SOCIETY</div>
            </div>
          )}
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item ${tab === n.id ? "active" : ""}`}
              onClick={() => setTab(n.id)}
              title={n.label}
            >
              <span className="nav-icon">{n.icon}</span>
              {!collapsed && <span className="nav-label">{n.label}</span>}
            </button>
          ))}
        </nav>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "▶" : "◀"}
        </button>
      </aside>

      <main className={`main-content ${collapsed ? "collapsed" : ""}`}>
        <div className="page-wrap">
          {tab === "dashboard"   && <DashboardPage />}
          {tab === "residents"   && <ResidentsPage />}
          {tab === "payments"    && <PaymentsPage />}
          {tab === "complaints"  && <ComplaintsPage />}
          {tab === "notices"     && <NoticesPage />}
          {tab === "bookings"    && <BookingsPage />}
          {tab === "chat"        && <ChatPage />}
          {tab === "maintenance" && <MaintenancePage />}
          {tab === "devops"      && <DevOpsPage />}
        </div>
      </main>
    </div>
  );
}
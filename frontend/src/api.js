const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const api = {
  async submitComplaint(data) {
    const r = await fetch(`${BASE}/complaint/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    return r.json();
  },
  async getComplaints() {
    return (await fetch(`${BASE}/complaint/`)).json();
  },
  async updateComplaintStatus(id, status) {
    return (await fetch(`${BASE}/complaint/${id}/status?status=${status}`, { method: "PATCH" })).json();
  },
  async sendChat(message) {
    const r = await fetch(`${BASE}/chat/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
    return r.json();
  },
  async submitMaintenance(data) {
    const r = await fetch(`${BASE}/maintenance/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    return r.json();
  },
  async getMaintenance() {
    return (await fetch(`${BASE}/maintenance/`)).json();
  },
  async deployAction(action, target = "backend") {
    const r = await fetch(`${BASE}/deploy/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, target }) });
    return r.json();
  },
  async getDeployStatus() {
    return (await fetch(`${BASE}/deploy/status`)).json();
  },
  async getResidents() {
    return (await fetch(`${BASE}/residents/`)).json();
  },
  async addResident(data) {
    const r = await fetch(`${BASE}/residents/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    return r.json();
  },
  async deleteResident(id) {
    return (await fetch(`${BASE}/residents/${id}`, { method: "DELETE" })).json();
  },
  async getPayments() {
    return (await fetch(`${BASE}/payments/`)).json();
  },
  async addPayment(data) {
    const r = await fetch(`${BASE}/payments/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    return r.json();
  },
  async updatePaymentStatus(id, status) {
    return (await fetch(`${BASE}/payments/${id}/status?status=${status}`, { method: "PATCH" })).json();
  },
  async getNotices() {
    return (await fetch(`${BASE}/notices/`)).json();
  },
  async addNotice(data) {
    const r = await fetch(`${BASE}/notices/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    return r.json();
  },
  async deleteNotice(id) {
    return (await fetch(`${BASE}/notices/${id}`, { method: "DELETE" })).json();
  },
  async getBookings() {
    return (await fetch(`${BASE}/bookings/`)).json();
  },
  async addBooking(data) {
    const r = await fetch(`${BASE}/bookings/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    return r.json();
  },
  async getFacilities() {
    return (await fetch(`${BASE}/bookings/facilities`)).json();
  },
  async getInsights() {
    return (await fetch(`${BASE}/insights/`)).json();
  },
};
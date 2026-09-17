import { api } from "./api";

export async function getAdminStats() {
  return api("/admin/stats");
}

export async function getPatients(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  const qs = query.toString() ? `?${query.toString()}` : "";
  return api(`/admin/patients${qs}`);
}

export async function getPatient(id) {
  return api(`/admin/patients/${id}`);
}

export async function createPatient(data) {
  return api("/admin/patients", { method: "POST", body: data });
}

export async function updatePatient(id, data) {
  return api(`/admin/patients/${id}`, { method: "PUT", body: data });
}

export async function deletePatient(id) {
  return api(`/admin/patients/${id}`, { method: "DELETE" });
}

export async function getDoctors(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  const qs = query.toString() ? `?${query.toString()}` : "";
  return api(`/admin/doctors${qs}`);
}

export async function getDoctor(id) {
  return api(`/admin/doctors/${id}`);
}

export async function createDoctor(data) {
  return api("/admin/doctors", { method: "POST", body: data });
}

export async function updateDoctor(id, data) {
  return api(`/admin/doctors/${id}`, { method: "PUT", body: data });
}

export async function deleteDoctor(id) {
  return api(`/admin/doctors/${id}`, { method: "DELETE" });
}

export async function setUserStatus(id, isActive) {
  return api(`/admin/users/${id}/status`, { method: "PATCH", body: { isActive } });
}

export async function setUserRole(id, role) {
  return api(`/admin/users/${id}/role`, { method: "PATCH", body: { role } });
}

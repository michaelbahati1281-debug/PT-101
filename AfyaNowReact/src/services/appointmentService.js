import { api } from "./api";
export const createAppointment = (data) => api("/appointments", { method: "POST", body: data });
export const getAppointments = () => api("/appointments");
export const cancelAppointment = (id) => api(`/appointments/${id}/cancel`, { method: "POST" });
export const rescheduleAppointment = (id, data) => api(`/appointments/${id}/reschedule`, { method: "POST", body: data });

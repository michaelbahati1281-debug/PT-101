import { api } from "./api";
export const getDoctors = (query = "") => api(`/doctors${query ? `?${query}` : ""}`);
export const getDoctor = (id) => api(`/doctors/${id}`);
export const getDoctorHospitals = (id) => api(`/doctors/${id}/hospitals`);
export const getAvailableSlots = (id, query) => api(`/doctors/${id}/available-slots?${query}`);

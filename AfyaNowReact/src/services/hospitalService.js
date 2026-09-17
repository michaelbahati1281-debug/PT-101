import { api } from "./api";
export const getHospitals = (query = "") => api(`/hospitals${query ? `?${query}` : ""}`);
export const getHospital = (id) => api(`/hospitals/${id}`);

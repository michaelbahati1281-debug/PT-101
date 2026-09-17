import { api } from "./api";
export const getServices = (query = "") => api(`/services${query ? `?${query}` : ""}`);
export const getService = (id) => api(`/services/${id}`);

import { api } from "./api";
export const initiatePayment = (data) => api("/payments/initiate", { method: "POST", body: data });
export const getPayment = (id) => api(`/payments/${id}`);

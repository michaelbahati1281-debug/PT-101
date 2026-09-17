import { api } from "./api";
export const getNotifications = () => api("/notifications");
export const markRead = (id) => api(`/notifications/${id}/read`, { method: "PATCH" });
export const markAllRead = () => api("/notifications/read-all", { method: "PATCH" });

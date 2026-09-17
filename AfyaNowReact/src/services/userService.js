import { api } from "./api";

export async function getUsers(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.role) query.append("role", params.role);
  const qs = query.toString() ? `?${query.toString()}` : "";
  return api(`/users${qs}`);
}

export async function getUserById(id) {
  return api(`/users/${id}`);
}

const API_BASE_URL =
  import.meta.env?.VITE_API_URL || "http://localhost:5000/api/v1";

export async function api(path, { method = "GET", body, headers: extraHeaders = {} } = {}) {
  const token = localStorage.getItem("afyanowAccessToken");
  const headers = { ...extraHeaders };

  if (body && typeof body === "object") headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body && typeof body === "object" ? JSON.stringify(body) : undefined,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(result.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.code = result.error;
    throw error;
  }

  return result.data;
}

export async function getHospitals(params = {}) {
  const query = new URLSearchParams();

  if (params.search) query.append("search", params.search);
  if (params.region && params.region !== "All") {
    query.append("region", params.region);
  }
  if (params.district) query.append("district", params.district);

  const data = await api(`/hospitals${query.toString() ? `?${query.toString()}` : ""}`);
  return data || [];
}

export async function getHospital(id) {
  return api(`/hospitals/${id}`);
}

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export function getToken() {
  return localStorage.getItem("pos_auth_token");
}

export function setToken(token) {
  localStorage.setItem("pos_auth_token", token);
}

export function clearToken() {
  localStorage.removeItem("pos_auth_token");
}

export function clearAuthStorage() {
  clearToken();
  localStorage.removeItem("pos_auth_user");
  localStorage.removeItem("pos_role");
}

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (res.status === 401 && path !== "/auth/login") {
    clearAuthStorage();
    window.location.replace("/login");
    throw new Error("Session expired, please log in again");
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error?.message || `Request failed (${res.status})`);
  }

  return data;
}

export function apiGet(path) {
  return request(path);
}

export function apiPost(path, body) {
  return request(path, { method: "POST", body: JSON.stringify(body) });
}

export function apiPut(path, body) {
  return request(path, { method: "PUT", body: JSON.stringify(body) });
}

export function apiPatch(path, body) {
  return request(path, { method: "PATCH", body: JSON.stringify(body) });
}

export function apiDelete(path) {
  return request(path, { method: "DELETE" });
}

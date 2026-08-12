const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : null;

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

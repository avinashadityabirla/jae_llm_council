const API_BASE = "http://localhost:4000/api";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },

    ...options,
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(`API ${response.status}: ${text}`);
  }

  return response.json();
}

export const jdApi = {
  list: () => request("/jd"),

  get: (id) => request(`/jd/${id}`),

  create: (wizardData) =>
    request("/jd", { method: "POST", body: JSON.stringify({ wizardData }) }),

  update: (id, wizardData) =>
    request(`/jd/${id}`, {
      method: "PUT",
      body: JSON.stringify({ wizardData }),
    }),

  generate: (id) => request(`/jd/${id}/generate`, { method: "POST" }),

  finalize: (id) => request(`/jd/${id}/finalize`, { method: "POST" }),

  reopen: (id) => request(`/jd/${id}/reopen`, { method: "POST" }),

  remove: (id) => request(`/jd/${id}`, { method: "DELETE" }),
};

export const healthCheck = () => request("/health");

const BASE = "/api";

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} — ${text}`);
  }
  return res.json();
}

export const api = {
  health: () => request("/health"),
  stats: () => request("/index/stats"),
  build: () => request("/index/build", { method: "POST" }),
  candidates: () => request("/candidates"),
  resume: (name) => request(`/candidates/${encodeURIComponent(name)}/resume`),
  jds: () => request("/jds"),
  match: (body) =>
    request("/match", { method: "POST", body: JSON.stringify(body) }),
};

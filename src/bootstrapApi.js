// src/bootstrapApi.js
import axios from "axios";

// -------- Read API URL from Vite or CRA envs --------
let ENV_URL = "";
try {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    ENV_URL = import.meta.env.VITE_API_URL || "";
  }
} catch {}
ENV_URL = ENV_URL || process.env.REACT_APP_API_URL || "";

// fallback to your live backend if env isn’t set
const FALLBACK_URL = "https://protopiabackend-production.up.railway.app";
const API_BASE = (ENV_URL || FALLBACK_URL).replace(/\/$/, "");

// Normalize any URL your code passes in (fixes localhost, prefixes /api)
function normalizeUrl(u = "") {
  u = String(u);

  // strip hard-coded localhost/dev origins
  u = u.replace(/^https?:\/\/(127\.0\.0\.1|localhost):8000/gi, "");

  // make 'api/...' into '/api/...'
  if (u.startsWith("api/")) u = `/${u}`;

  // ensure API paths are absolute to API_BASE
  if (u.startsWith("/api/")) return `${API_BASE}${u}`;

  // already absolute http(s) URL
  if (/^https?:\/\//i.test(u)) return u;

  // non-API relative path (static etc.)
  return u;
}

// ---- Patch fetch so any fetch('/api/...') or localhost is routed correctly
if (typeof window !== "undefined" && typeof window.fetch === "function") {
  const realFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    let url = typeof input === "string" ? input : input?.url || "";
    url = normalizeUrl(url);

    let opts = init ?? {};
    // attach JWT if present
    try {
      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");
      if (token && url.startsWith(API_BASE)) {
        opts = { ...(opts || {}) };
        opts.headers = { ...(opts.headers || {}), Authorization: `Bearer ${token}` };
      }
    } catch {}

    return realFetch(url, opts);
  };
}

// ---- Configure axios globally the same way
axios.defaults.baseURL = API_BASE;
axios.interceptors.request.use((config = {}) => {
  let u = config.url || "";

  // strip hard-coded localhost/dev origins
  u = u.replace(/^https?:\/\/(127\.0\.0\.1|localhost):8000/gi, "");

  // make 'api/...' into '/api/...'
  if (u.startsWith("api/")) u = `/${u}`;

  // ensure API paths go to backend
  if (u.startsWith("/api/")) {
    config.baseURL = API_BASE;
  }
  config.url = u;

  // attach JWT if present
  try {
    const token =
      localStorage.getItem("access") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");
    if (token) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
    }
  } catch {}

  return config;
});

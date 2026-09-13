import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "sc_admin_token";

export const api = axios.create({ baseURL: API, withCredentials: true });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const setToken = (token) => (token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY));

export function formatApiError(err) {
  const detail = err?.response?.data?.detail;
  if (detail == null) return err?.message || "Terjadi kesalahan. Coba lagi.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export const formatRupiah = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

export const waLink = (number, message = "") =>
  `https://wa.me/${String(number || "").replace(/\D/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

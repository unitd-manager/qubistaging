import axios from "axios";

// Get Strapi URL from environment variable
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const isDev = import.meta.env.DEV;

// Create reusable Axios instance with base URL pointing to Strapi API
// In dev mode, use vite proxy; in prod, use direct URL
export const api = axios.create({
  baseURL: isDev ? "/api" : `${STRAPI_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to resolve media URLs (handles both relative and absolute URLs from Strapi)
export function getStrapiMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (isDev) {
    // In dev mode, use vite proxy for uploads too
    return url.startsWith("/uploads") ? url : `${STRAPI_URL}${url}`;
  }
  return `${STRAPI_URL}${url}`;
}

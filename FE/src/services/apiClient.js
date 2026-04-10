import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Helper: convert camelCase object → snake_case object (1 level deep is sufficient)
const toSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const convertKeysToSnakeCase = (obj) => {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToSnakeCase);
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      toSnakeCase(key),
      convertKeysToSnakeCase(value),
    ])
  );
};

// Helper: convert snake_case object → camelCase object
const toCamelCase = (str) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const convertKeysToCamelCase = (obj) => {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToCamelCase);
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      toCamelCase(key),
      convertKeysToCamelCase(value),
    ])
  );
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── REQUEST interceptor ──────────────────────────────────────
// Attach token + convert body camelCase → snake_case before sending to BE
apiClient.interceptors.request.use((config) => {
  // Attach JWT token
  const savedAuth = localStorage.getItem("auth");
  if (savedAuth) {
    try {
      const { token } = JSON.parse(savedAuth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("auth");
    }
  }

  // Convert request body to snake_case (because BE uses SNAKE_CASE)
  if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
    config.data = convertKeysToSnakeCase(config.data);
  }

  return config;
});

// ── RESPONSE interceptor ─────────────────────────────────────
// Convert response body snake_case → camelCase before FE uses it
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object" && !(response.data instanceof Blob)) {
      response.data = convertKeysToCamelCase(response.data);
    }
    return response;
  },
  (error) => {
    // Also convert error response body to camelCase
    if (error.response?.data && typeof error.response.data === "object") {
      error.response.data = convertKeysToCamelCase(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
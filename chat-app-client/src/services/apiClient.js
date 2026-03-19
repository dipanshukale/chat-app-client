import { API_BASE_URL } from "../config/api";

function getStoredToken() {
  try {
    return localStorage.getItem("token") || null;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function parseJsonSafely(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Centralized API request helper.
 * - Attaches Bearer token (when present)
 * - Sends cookies when requested (credentials: 'include')
 * - Throws ApiError with status + payload on non-2xx responses
 */
export async function apiRequest(pathOrUrl, options = {}) {
  const url =
    typeof pathOrUrl === "string" && pathOrUrl.startsWith("http")
      ? pathOrUrl
      : `${API_BASE_URL}${pathOrUrl?.startsWith("/") ? "" : "/"}${pathOrUrl}`;

  const {
    headers,
    auth = "bearer",
    credentials = "include",
    ...rest
  } = options;

  const token = auth === "bearer" ? getStoredToken() : null;

  const response = await fetch(url, {
    credentials,
    ...rest,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : null),
      ...headers,
    },
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && payload.message) ||
      `Request failed (${response.status})`;
    throw new ApiError(message, { status: response.status, payload });
  }

  return payload;
}


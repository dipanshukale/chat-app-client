import cors from "cors";
import { env } from "./config.js";

function normalizeOrigin(origin) {
  if (!origin) return null;
  return origin.replace(/\/$/, "");
}

export function corsMiddleware() {
  const allowlist = new Set(
    [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      env.clientUrl,
    ]
      .map(normalizeOrigin)
      .filter(Boolean)
  );

  return cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl/postman) with no Origin header
      if (!origin) return callback(null, true);
      const normalized = normalizeOrigin(origin);
      if (allowlist.has(normalized)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
}


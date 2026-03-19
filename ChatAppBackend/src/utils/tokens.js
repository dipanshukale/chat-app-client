import jwt from "jsonwebtoken";
import { env } from "../config/config.js";

const ACCESS_COOKIE = "token"; // legacy cookie name used by current frontend
const REFRESH_COOKIE = "refreshToken";

export function signAccessToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.accessExpiresIn });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.refreshExpiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

export function getAccessCookieName() {
  return ACCESS_COOKIE;
}

export function getRefreshCookieName() {
  return REFRESH_COOKIE;
}

export function getCookieOptions() {
  const isProd = env.nodeEnv === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
  };
}


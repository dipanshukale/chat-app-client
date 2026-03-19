import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  getAccessCookieName,
  getCookieOptions,
  getRefreshCookieName,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from "../utils/tokens.js";

function sanitizeUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    followers: user.followers,
    following: user.following,
    profilePicture: user.profilePicture,
  };
}

export async function signup({ username, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  return { message: "User registered successfully" };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.statusCode = 400;
    throw err;
  }

  const accessToken = signAccessToken({ id: user._id });
  const refreshToken = signRefreshToken({ id: user._id, type: "refresh" });

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
}

export function setAuthCookies(res, { accessToken, refreshToken }) {
  const opts = getCookieOptions();
  res.cookie(getAccessCookieName(), accessToken, opts);
  res.cookie(getRefreshCookieName(), refreshToken, opts);
}

export function clearAuthCookies(res) {
  const opts = getCookieOptions();
  res.clearCookie(getAccessCookieName(), opts);
  res.clearCookie(getRefreshCookieName(), opts);
}

export async function refresh(refreshToken) {
  if (!refreshToken) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }

  const decoded = verifyToken(refreshToken);
  if (decoded.type && decoded.type !== "refresh") {
    const err = new Error("Invalid token");
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 401;
    throw err;
  }

  const accessToken = signAccessToken({ id: user._id });
  const newRefreshToken = signRefreshToken({ id: user._id, type: "refresh" });

  return { accessToken, refreshToken: newRefreshToken, user: sanitizeUser(user) };
}


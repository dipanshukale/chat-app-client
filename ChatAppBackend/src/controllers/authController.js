import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  clearAuthCookies,
  login,
  refresh,
  setAuthCookies,
  signup,
} from "../services/authService.js";
import { getRefreshCookieName } from "../utils/tokens.js";

function throwValidationIfAny(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error(errors.array()[0].msg);
    err.statusCode = 400;
    throw err;
  }
}

export const signupController = asyncHandler(async (req, res) => {
  throwValidationIfAny(req);
  const result = await signup(req.body);
  res.status(201).json(result);
});

export const loginController = asyncHandler(async (req, res) => {
  throwValidationIfAny(req);
  const { accessToken, refreshToken, user } = await login(req.body);
  setAuthCookies(res, { accessToken, refreshToken });

  // Preserve existing response shape: { token, user }
  res.json({ token: accessToken, user });
});

export const logoutController = asyncHandler(async (req, res) => {
  clearAuthCookies(res);
  res.json({ message: "Logged out successfully" });
});

export const refreshController = asyncHandler(async (req, res) => {
  const token = req.cookies?.[getRefreshCookieName()];
  const { accessToken, refreshToken, user } = await refresh(token);
  setAuthCookies(res, { accessToken, refreshToken });
  res.json({ token: accessToken, user });
});


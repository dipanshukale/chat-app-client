import User from "../models/User.js";
import { getAccessCookieName, verifyToken } from "../utils/tokens.js";

export async function protect(req, res, next) {
  try {
    const header = req.header("Authorization");
    const bearer = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
    const cookieToken = req.cookies?.[getAccessCookieName()];
    const token = bearer || cookieToken;

    if (!token) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 401;
      throw err;
    }

    req.user = user;
    next();
  } catch (e) {
    e.statusCode = e.statusCode || 401;
    next(e);
  }
}


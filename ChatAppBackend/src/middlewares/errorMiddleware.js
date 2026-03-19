import { env } from "../config/config.js";

export function notFound(req, res, next) {
  const err = new Error(`Not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
}

export function errorHandler(err, req, res, next) {
  const statusCode = Number(err.statusCode || err.status || 500);
  const message = err.message || "Internal server error";

  if (res.headersSent) return next(err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv === "development" ? { stack: err.stack } : {}),
  });
}


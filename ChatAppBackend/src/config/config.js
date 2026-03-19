export let env = null;

export function loadConfig() {
  env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 5000),
    mongoUri: process.env.MONGO_URI,
    jwt: {
      secret: process.env.JWT_SECRET,
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  };

  return env;
}

export function assertRequiredEnv() {
  if (!env) loadConfig();
  const missing = [];
  if (!env.mongoUri) missing.push("MONGO_URI");
  if (!env.jwt.secret) missing.push("JWT_SECRET");
  if (missing.length) {
    const msg = `Missing required env vars: ${missing.join(", ")}`;
    const err = new Error(msg);
    err.statusCode = 500;
    throw err;
  }
}


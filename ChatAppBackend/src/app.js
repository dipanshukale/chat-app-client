import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { corsMiddleware } from "./config/cors.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

export function createApp({ chatRoutes }) {
  const app = express();

  app.use(helmet());
  app.use(morgan("dev"));
  app.use(corsMiddleware());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(authRoutes);
  app.use(userRoutes);
  app.use(chatRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}


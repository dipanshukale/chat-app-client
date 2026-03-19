import mongoose from "mongoose";
import { env } from "./config.js";

export async function connectDb() {
  await mongoose.connect(env.mongoUri);
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
}


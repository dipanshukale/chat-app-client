import { config as dotenvConfig } from "dotenv";

export function loadEnv() {
  dotenvConfig({ path: ".env" });
}


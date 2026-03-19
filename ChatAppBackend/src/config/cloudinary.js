import cloudinary from "cloudinary";
import { env } from "./config.js";

export function configureCloudinary() {
  cloudinary.v2.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
}

export { cloudinary };


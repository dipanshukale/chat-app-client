import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  deleteAllController,
  markAsReadController,
  messagesController,
  sendController,
  unreadCountController,
  uploadController,
} from "../controllers/chatController.js";
import { upload } from "../config/upload.js";

export function createChatRoutes({ io }) {
  const router = Router();

  router.post("/send", protect, upload.single("image"), sendController(io));
  router.post("/upload", upload.single("image"), uploadController);

  router.get("/messages/unread", protect, unreadCountController);
  router.put("/messages/mark-as-read/:senderId", protect, markAsReadController);
  router.get("/messages/:receiverId", protect, messagesController);
  router.delete("/messages/delete-all/:receiverId", protect, deleteAllController);

  return router;
}


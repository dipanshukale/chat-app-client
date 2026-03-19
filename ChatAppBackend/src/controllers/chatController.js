import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteAllBetween,
  getMessagesBetween,
  getUnreadCount,
  markAsRead,
  sendMessage,
} from "../services/chatService.js";

export const sendController = (io) =>
  asyncHandler(async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const newMessage = await sendMessage({ senderId, receiverId, message, imagePath });

    io.to([senderId, receiverId].sort().join("-")).emit("newMessage", newMessage);
    res.json(newMessage);
  });

export const uploadController = asyncHandler(async (req, res) => {
  if (!req.file) {
    const err = new Error("No file uploaded");
    err.statusCode = 400;
    throw err;
  }
  res.json({ imageUrl: `${req.file.filename || req.file.path}` });
});

export const unreadCountController = asyncHandler(async (req, res) => {
  const result = await getUnreadCount({ receiverId: req.user.id });
  res.json(result);
});

export const markAsReadController = asyncHandler(async (req, res) => {
  const result = await markAsRead({ receiverId: req.user.id, senderId: req.params.senderId });
  res.json(result);
});

export const messagesController = asyncHandler(async (req, res) => {
  const messages = await getMessagesBetween({ userA: req.user.id, userB: req.params.receiverId });
  res.json(messages);
});

export const deleteAllController = asyncHandler(async (req, res) => {
  const result = await deleteAllBetween({ userA: req.user.id, userB: req.params.receiverId });
  res.json(result);
});


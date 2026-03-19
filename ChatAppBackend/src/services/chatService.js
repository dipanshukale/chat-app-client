import Message from "../models/Message.js";

export async function sendMessage({ senderId, receiverId, message, imagePath }) {
  if (!senderId || !receiverId) {
    const err = new Error("Missing senderId or receiverId");
    err.statusCode = 400;
    throw err;
  }

  const newMessage = new Message({
    sender: senderId,
    receiver: receiverId,
    message: message || "",
    image: imagePath || null,
  });

  await newMessage.save();
  return newMessage;
}

export async function getUnreadCount({ receiverId }) {
  const unreadMessages = await Message.countDocuments({
    receiver: receiverId,
    read: false,
  });
  return { count: unreadMessages };
}

export async function markAsRead({ receiverId, senderId }) {
  await Message.updateMany(
    { sender: senderId, receiver: receiverId, read: false },
    { $set: { read: true } }
  );
  return { success: true, message: "Messages marked as read" };
}

export async function getMessagesBetween({ userA, userB }) {
  return await Message.find({
    $or: [
      { sender: userA, receiver: userB },
      { sender: userB, receiver: userA },
    ],
  }).sort("timestamp");
}

export async function deleteAllBetween({ userA, userB }) {
  await Message.deleteMany({
    $or: [
      { sender: userA, receiver: userB },
      { sender: userB, receiver: userA },
    ],
  });
  return { success: true, message: "All messages deleted successfully" };
}


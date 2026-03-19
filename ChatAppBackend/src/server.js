import http from "http";
import { Server } from "socket.io";

import { loadEnv } from "./config/env.js";
import { assertRequiredEnv, env, loadConfig } from "./config/config.js";
import { connectDb } from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { createApp } from "./app.js";
import { createChatRoutes } from "./routes/chatRoutes.js";

loadEnv();
loadConfig();
assertRequiredEnv();
configureCloudinary();

await connectDb();

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: [env.clientUrl, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("sendMessage", async (message) => {
    const room = [message.senderId, message.receiverId].sort().join("-");
    io.to(room).emit("newMessage", message);
  });
});

const app = createApp({ chatRoutes: createChatRoutes({ io }) });
server.on("request", app);

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${env.port}`);
});


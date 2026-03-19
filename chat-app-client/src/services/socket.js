import { io } from "socket.io-client";
import { SOCKET_OPTIONS, SOCKET_URL } from "../config/api";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, SOCKET_OPTIONS);
  }
  return socket;
}


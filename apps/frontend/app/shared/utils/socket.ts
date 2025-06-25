import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (serverUrl: string): Socket => {
  if (!socket) {
    socket = io(serverUrl);
  }
  return socket;
};
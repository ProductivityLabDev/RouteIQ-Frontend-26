import { io, Socket } from "socket.io-client";
import { BASE_URL } from "@/configs/api";

let socket: Socket | null = null;

export const socketService = {
  connect: (token: string): Socket => {
    if (socket?.connected) return socket;

    socket = io(`${BASE_URL}/chat`, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected to /chat");
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
      console.log("[Socket] Manually disconnected");
    }
  },

  getSocket: (): Socket | null => socket,

  // Emit events
  sendMessage: (data: {
    conversationId: number;
    content: string;
    fileUrl?: string;
    fileType?: string;
  }) => {
    socket?.emit("send_message", data);
  },

  startTyping: (conversationId: number) => {
    socket?.emit("typing", { conversationId });
  },

  stopTyping: (conversationId: number) => {
    socket?.emit("stop_typing", { conversationId });
  },

  // Listen events
  onNewMessage: (callback: (message: any) => void) => {
    socket?.on("new_message", callback);
  },

  onUserTyping: (callback: (data: { conversationId: number; userId: number; name: string }) => void) => {
    socket?.on("user_typing", callback);
  },

  onUserStopTyping: (callback: (data: { conversationId: number; userId: number }) => void) => {
    socket?.on("user_stop_typing", callback);
  },

  // Cleanup listeners
  offNewMessage: () => {
    socket?.off("new_message");
  },

  offUserTyping: () => {
    socket?.off("user_typing");
  },

  offUserStopTyping: () => {
    socket?.off("user_stop_typing");
  },
};

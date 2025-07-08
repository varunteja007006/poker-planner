"use client";
import React from "react";

import { io, Socket } from "socket.io-client";

import { useParams } from "next/navigation";
import { getUserFromLocalStorage } from "@/utils/localStorage.utils";
import { toast } from "sonner";

interface SocketContextType {
  socket: Socket | null;
}

const socketContext = React.createContext<SocketContextType | undefined>(
  undefined
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const roomCode = params.roomCode;

  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    const user = getUserFromLocalStorage();
    const username = user?.username;

    const user_token = user?.user_token;

    if (!user_token || !username) {
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      // withCredentials: true,
      auth: {
        token: user_token,
      },
      query: {
        username: username,
        room_code: roomCode,
      },
      // closeOnBeforeunload: true,
    });

    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "dev") {
      socket.on("connect", () => {
        console.log("Connected to ws server");
        console.log("Is socket active: ", socket.active);
        console.log("Is socket connected: ", socket.connected);
        console.log("socket Id: ", socket.id);
      });

      socket.on("error", (error) => {
        console.error("Error from ws server", error);
        console.log("Is socket active: ", socket.active);
        console.log("Is socket connected: ", socket.connected);
        console.log("socket Id: ", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from ws server");
        console.log("Is socket active: ", socket.active);
        console.log("Is socket connected: ", socket.connected);
        console.log("socket Id: ", socket.id);
      });
    }

    // let us set the socket instance
    setSocket(socket);

    // let us also emit the room join event
    socket.emit("room:join", { room_code: roomCode, username });

    // socket to notify people about users joining the room
    socket.on(
      "room:joined",
      (response: { clientId: string; message: string }) => {
        toast.success(response.message);
      }
    );

    return () => {
      socket.off("room:joined");

      socket.disconnect();
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = React.useContext(socketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

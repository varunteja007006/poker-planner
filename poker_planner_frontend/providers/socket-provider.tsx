import React from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const socketContext = React.createContext<SocketContextType | undefined>(
  undefined
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      withCredentials: true,
    });

    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "dev") {
      socket.on("connect", () => {
        console.log("Connected to server");
        console.log("Is socket active: ", socket.active);
        console.log("Is socket connected: ", socket.connected);
        console.log("Is socket open: ", socket.open);
        console.log("socket Id: ", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
        console.log("Is socket active: ", socket.active);
        console.log("Is socket connected: ", socket.connected);
        console.log("Is socket open: ", socket.open);
        console.log("socket Id: ", socket.id);
      });
    }

    setSocket(socket);

    return () => {
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

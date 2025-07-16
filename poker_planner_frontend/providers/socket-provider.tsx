"use client";
import React from "react";

import { io, Socket } from "socket.io-client";

import { useParams } from "next/navigation";
import { getUserFromLocalStorage } from "@/utils/localStorage.utils";
import { toast } from "sonner";
import { Story } from "@/types/story.types";
import { StoriesStore } from "@/store/stories/stories.store";

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

  const updateStoryInStore = StoriesStore.useUpdateStory();

  // socket setup and listeners
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

    socket.on(
      "stories:created",
      (response: { clientId: string; message: string; body: Story }) => {
        toast.success(response.message);
        updateStoryInStore(response.body);
      }
    );

    socket.on(
      "story-points:created",
      (response: { clientId: string; message: string; body: Story }) => {}
    );

    socket.on(
      "story-points:private:created",
      (response: { clientId: string; message: string; body: Story }) => {
        toast.success(response.message);
      }
    );

    socket.on(
      "stories:updated",
      (response: { clientId: string; message: string; body: Story }) => {
        toast.success(response.message);
        updateStoryInStore(response.body);
      }
    );

    return () => {
      socket.off("room:joined");
      socket.off("stories:created");
      socket.off("stories:updated");
      socket.off("story-points:created");
      socket.off("story-points:private:created");

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

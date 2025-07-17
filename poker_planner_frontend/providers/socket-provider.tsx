"use client";
import React from "react";

import { toast } from "sonner";

import { io, Socket } from "socket.io-client";

import { useParams } from "next/navigation";
import { Story } from "@/types/story.types";
import { StoriesStore } from "@/store/stories/stories.store";
import { useAppContext } from "./app-provider";
import { Room } from "@/types/room.types";
import { Team } from "@/types/team.types";

interface SocketContextType {
  socket: Socket | null;
}

const socketContext = React.createContext<SocketContextType | undefined>(
  undefined
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const roomCode = params.roomCode;

  const { user, handleSetRoom, handleSetUserTeam } = useAppContext();

  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isReconnecting, setIsReconnecting] = React.useState(false);

  const updateStoryInStore = StoriesStore.useUpdateStory();

  // socket setup and listeners
  React.useEffect(() => {
    const username = user?.username;

    const user_token = user?.user_token;

    if (!user_token || !username) {
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      // withCredentials: true, // enable only when i figure out the issue with cookies and api testing
      auth: {
        token: user_token,
      },
      query: {
        username: username,
        room_code: roomCode,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000,
      // closeOnBeforeunload: true,
    });

    socket.on("connect", () => {
      console.log("Connected to ws server");
      console.log("Is socket active: ", socket.active);
      console.log("Is socket connected: ", socket.connected);
      console.log("socket Id: ", socket.id);
      setIsReconnecting(false);
      setSocket(socket);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsReconnecting(true);
    });

    socket.on("reconnect", () => {
      console.log("Reconnected to server");
      setIsReconnecting(false);
    });

    socket.on("reconnect_error", (error) => {
      console.error("Reconnect error:", error);
      setIsReconnecting(true);
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
      setIsReconnecting(true);
    });

    // let us also emit the room join event
    socket.emit(
      "room:join",
      { room_code: roomCode, user_token },
      (data: {
        clientId: string;
        message: string;
        joinedRooms: string[];
        currentRoomInfo: Room[];
        team: Team;
      }) => {
        handleSetRoom(data.currentRoomInfo?.[0]);
        handleSetUserTeam(data.team);
      }
    );

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
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      socket.off("room:joined");
      socket.off("stories:created");
      socket.off("stories:updated");
      socket.off("story-points:created");
      socket.off("story-points:private:created");
    };
  }, [
    user?.user_token,
    user?.username,
    roomCode,
    handleSetRoom,
    handleSetUserTeam,
  ]);

  // Reconnect logic when socket disconnects
  React.useEffect(() => {
    if (isReconnecting && socket) {
      socket.connect();
    }
  }, [isReconnecting, socket]);

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

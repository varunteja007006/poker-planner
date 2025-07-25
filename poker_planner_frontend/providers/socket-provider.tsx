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
import { StoriesPointsStore } from "@/store/story-points/story-points.store";
import { StoryPoint } from "@/types/story-points.types";
import { TeamStore } from "@/store/team/team.store";

interface SocketContextType {
  socket: Socket | null;
}

const socketContext = React.createContext<SocketContextType | undefined>(
  undefined
);

type SocketRoomResponse = {
  clientId: string;
  message: string;
  joinedRooms: string[];
  currentRoomInfo: Room[];
  team: Team;
  pendingStory: Story | null;
  teamMembers: Team[];
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const roomCode = params.roomCode;

  const { user, handleSetRoom, handleSetUserTeam } = useAppContext();

  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isReconnecting, setIsReconnecting] = React.useState(false);

  const updateTeam = TeamStore.useUpdateTeam();

  const updateStoryInStore = StoriesStore.useUpdateStory();
  const actionsStoryPointStore =
    StoriesPointsStore.useUpdateStoryPointsActions();

  // socket setup and listeners
  React.useEffect(() => {
    const username = user?.username;

    const user_token = user?.user_token;

    if (!user_token || !username) {
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL!, {
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
      (response: SocketRoomResponse) => {
        handleSetRoom(response.currentRoomInfo?.[0]);
        handleSetUserTeam(response.team);
      }
    );

    // socket to notify people about users joining the room
    socket.on("room:joined", (response: SocketRoomResponse) => {
      toast.success(response.message);
      updateTeam(response.teamMembers);
      if (response.pendingStory) {
        updateStoryInStore(response.pendingStory);
      }
    });

    socket.on(
      "stories:created",
      (response: { clientId: string; message: string; body: Story }) => {
        toast.success(response.message);
        updateStoryInStore(response.body);
        actionsStoryPointStore.updateStoryPointsMeta(null);
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
        actionsStoryPointStore.updateStoryPointsMeta(null);
      }
    );

    socket.on(
      "stories:updated",
      (response: {
        clientId: string;
        message: string;
        body: Story;
        storyPoints: StoryPoint[];
        groupByStoryPoint: Record<number, number>;
        averageStoryPoint: number;
      }) => {
        toast.success(response.message);
        updateStoryInStore(response.body);
        actionsStoryPointStore.updateStoryPointsMeta(response);
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

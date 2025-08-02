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
import { CommonStore, TMetadata } from "@/store/common/common.store";
import { setRoomInLocalStorage } from "@/utils/localStorage.utils";

const HEART_BEAT_INTERVAL = 5000; // 5 seconds

interface SocketContextType {
  socket: Socket | null;
}

const socketContext = React.createContext<SocketContextType | undefined>(
  undefined,
);

type SocketRoomResponse = {
  clientId: string;
  message: string;
  joinedRooms: string[];
  currentRoomInfo: Room[];
  team: Team;
  pendingStory: Story | null;
  teamMembers: Team[];
  storyPoints: StoryPoint[];
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const roomCode = params.roomCode;

  const { user } = useAppContext();

  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isReconnecting, setIsReconnecting] = React.useState(false);

  const useCommonStoreMetadataActions = CommonStore.useUpdateMetadataActions();

  const story = StoriesStore.useStory();
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
      setSocket(socket);

      // internal reconnection logic
      setIsReconnecting(false);

      // heart beat start
      socket.emit("teams:heart-beat", {
        room_code: roomCode,
        user_token,
        is_online: true,
      });
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
      socket.emit("teams:heart-beat", {
        room_code: roomCode,
        user_token,
        is_online: false,
      });
      console.log("socket Id: ", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from ws server");
      console.log("Is socket active: ", socket.active);
      console.log("Is socket connected: ", socket.connected);
      console.log("socket Id: ", socket.id);

      // reconnection logic handled here
      setIsReconnecting(true);

      // heart beat logic
      socket.emit("teams:heart-beat", {
        room_code: roomCode,
        user_token,
        is_online: false,
      });
    });

    // let us also emit the room join event
    socket.emit(
      "room:join",
      { room_code: roomCode, user_token },
      (response: SocketRoomResponse) => {
        actionsStoryPointStore.updateStoryPointsData(response.storyPoints);
      },
    );

    // room metadata
    socket.emit(
      "common:room-metadata",
      {
        room_code: roomCode,
        user_token,
        story_id: story ? story.id : undefined,
      },
      (response: TMetadata) => {
        console.log("Returned value", response);
        setRoomInLocalStorage(response.room);
        useCommonStoreMetadataActions.updateMetadata(response);
      },
    );

    // socket to notify people about users joining the room
    socket.on("room:joined", (response: SocketRoomResponse) => {
      toast.success(response.message);
      if (response.pendingStory) {
        updateStoryInStore(response.pendingStory);
      }
    });

    // socket to notify people about new story being added and clear the prev story points metadata
    socket.on(
      "stories:created",
      (response: { clientId: string; message: string; body: Story }) => {
        toast.success(response.message);
        //  new story added in the state
        updateStoryInStore(response.body);
        // reset the story points meta which is the old one
        actionsStoryPointStore.updateStoryPointsMeta(null);
      },
    );

    // socket to notify people about story points being added
    socket.on(
      "story-points:created",
      (response: {
        clientId: string;
        message: string;
        storyPoint: StoryPoint;
        storyPoints: StoryPoint[];
      }) => {
        actionsStoryPointStore.updateStoryPointsData(response.storyPoints);
      },
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
        // update the story in the store
        updateStoryInStore(response.body);
        // update the story points meta in the store
        actionsStoryPointStore.updateStoryPointsMeta(response);
      },
    );

    socket.on("common:room-metadata-update", (response: Partial<TMetadata>) => {
      console.log("Common Metadata: ", response);
      useCommonStoreMetadataActions.updateMetadataPartially(response);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      socket.off("room:joined");
      socket.off("stories:created");
      socket.off("stories:updated");
      socket.off("story-points:created");
      socket.off("common:room-metadata-update");
    };
  }, [user?.user_token, user?.username, roomCode]);

  // Reconnect logic when socket disconnects
  React.useEffect(() => {
    if (isReconnecting && socket) {
      socket.connect();
    }
  }, [isReconnecting, socket]);

  // send heart beat to the server to keep the connection alive
  React.useEffect(() => {
    const user_token = user?.user_token;
    const interval = setInterval(() => {
      if (socket && roomCode && user_token) {
        socket.emit("teams:heart-beat", {
          room_code: roomCode,
          user_token,
          is_online: true,
        });
      }
    }, HEART_BEAT_INTERVAL);
    return () => clearInterval(interval);
  }, [socket, roomCode, user?.user_token]);

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

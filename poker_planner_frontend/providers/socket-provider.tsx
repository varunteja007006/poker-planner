"use client";
import React from "react";

import { io, Socket } from "socket.io-client";

import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "./app-provider";
import { CommonStore, TMetadata } from "@/store/common/common.store";
import { setRoomInLocalStorage } from "@/utils/localStorage.utils";

const HEART_BEAT_INTERVAL = 5000; // 5 seconds

interface SocketContextType {
  socket: Socket | null;
  emitMetadata: (cb?: (response: TMetadata) => void) => void;
  emitLeaveRoom: (cb?: () => void) => void;
}

const socketContext = React.createContext<SocketContextType | undefined>(
  undefined,
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const roomCode = params.roomCode;
  const router = useRouter();

  const { user } = useAppContext();

  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isReconnecting, setIsReconnecting] = React.useState(false);

  const useCommonStoreMetadataActions = CommonStore.useUpdateMetadataActions();
  const story = CommonStore.useMetadata()?.inProgressStory;

  const emitMetadata = (cb?: (response: TMetadata) => void) => {
    if (socket) {
      socket.emit(
        "common:room-metadata",
        {
          room_code: roomCode,
          user_token: user?.user_token,
          story_id: story?.id ? story.id : undefined,
        },
        cb,
      );
    }
  };

  const emitLeaveRoom = (cb?: () => void) => {
    if (socket) {
      socket.emit(
        "teams:heart-beat",
        {
          room_code: roomCode,
          user_token: user?.user_token,
          is_online: false,
        },
        cb,
      );
      emitMetadata(() => router.push("/room"));
    }
  };

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
    socket.emit("room:join", { room_code: roomCode, user_token });

    // room metadata
    socket.emit(
      "common:room-metadata",
      {
        room_code: roomCode,
        user_token,
        story_id: story ? story.id : undefined,
      },
      (response: TMetadata) => {
        setRoomInLocalStorage(response.room);
        useCommonStoreMetadataActions.updateMetadata(response);
      },
    );

    socket.on("common:room-metadata-update", (response: Partial<TMetadata>) => {
      useCommonStoreMetadataActions.updateMetadataPartially(response);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
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
    <socketContext.Provider value={{ socket, emitMetadata, emitLeaveRoom }}>
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

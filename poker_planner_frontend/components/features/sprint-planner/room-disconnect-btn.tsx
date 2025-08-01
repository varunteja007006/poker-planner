"use client";

import React from "react";

import { Button } from "@/components/ui/button";

import { useSocketContext } from "@/providers/socket-provider";
import { useParams } from "next/navigation";
import { useAppContext } from "@/providers/app-provider";
import { useRouter } from "next/navigation";

export default function RoomDisconnectBtn() {
  const params = useParams();
  const router = useRouter();

  const roomCode = params.roomCode;

  const { socket } = useSocketContext();

  const { user } = useAppContext();

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit("teams:heart-beat", {
        room_code: roomCode,
        user_token: user?.user_token,
        is_online: false,
      });
      router.push("/room");
    }
  };

  return (
    <Button
      className="cursor-pointer"
      variant="destructive"
      onClick={handleLeaveRoom}
    >
      Leave Room
    </Button>
  );
}

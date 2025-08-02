"use client";

import React from "react";

import { Button } from "@/components/ui/button";

import { useSocketContext } from "@/providers/socket-provider";

export default function RoomDisconnectBtn() {
  const { emitLeaveRoom } = useSocketContext();

  const handleLeaveRoom = () => {
    emitLeaveRoom();
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

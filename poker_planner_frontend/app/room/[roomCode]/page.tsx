"use client";
import React from "react";

import RoomCodeMain from "@/components/features/sprint-planner/room-code-main";
import { SocketProvider } from "@/providers/socket-provider";

export default function RoomCode() {
  return (
    <SocketProvider>
      <RoomCodeMain />
    </SocketProvider>
  );
}

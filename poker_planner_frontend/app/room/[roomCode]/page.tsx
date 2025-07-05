import React from "react";

import RoomCodeMain from "@/components/features/sprint-planner/RoomCodeMain";
import { SocketProvider } from "@/providers/socket-provider";

export default function RoomCode() {
  return (
    <SocketProvider>
      <RoomCodeMain />
    </SocketProvider>
  );
}

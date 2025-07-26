import React from "react";

import CreateRoom from "@/components/features/sprint-planner/create-room";
import JoinRoom from "@/components/features/sprint-planner/join-room";
import RoomHistoryList from "@/components/features/sprint-planner/room-history-list";

export default function Room() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex h-full w-full flex-col items-center justify-center md:flex-row">
        <div className="h-full w-full p-10">
          <CreateRoom />
        </div>
        <div className="h-full w-full p-10">
          <JoinRoom />
        </div>
      </div>
      <div className="h-full w-full p-10">
        <RoomHistoryList />
      </div>
    </div>
  );
}

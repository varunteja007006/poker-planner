import React from "react";

import CreateRoom from "@/components/features/sprint-planner/create-room";
import JoinRoom from "@/components/features/sprint-planner/join-room";
import RoomHistoryList from "@/components/features/sprint-planner/room-history-list";

export default function Room() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row h-full w-full items-center justify-center">
        <div className="w-full h-full p-10">
          <CreateRoom />
        </div>
        <div className="w-full h-full p-10">
          <JoinRoom />
        </div>
      </div>
      <div className="w-full h-full p-10">
        <RoomHistoryList />
      </div>
    </div>
  );
}

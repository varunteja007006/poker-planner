"use client";
import React from "react";

import RoomCodeCopyBtn from "./RoomCodeCopyBtn";

import { useParams } from "next/navigation";
import Participants from "./Participants";
import SprintCards from "./sprint-cards";
import SprintDeck from "./sprint-deck";
import { useCreateTeam } from "@/api/team/query";

export default function RoomCodeMain() {
  const params = useParams();
  const roomCode = params.roomCode;

  const createTeam = useCreateTeam();

  const handleCreateTeam = () => {
    if (!roomCode) return;

    createTeam.mutate({
      room_code: roomCode as string,
    });
  };

  React.useEffect(() => {
    handleCreateTeam();
  }, [roomCode]);

  return (
    <div className="p-4 flex flex-col w-full gap-5">
      <div className="flex flex-row items-start justify-between gap-2">
        <div></div>
        <div>
          <RoomCodeCopyBtn />
        </div>
      </div>
      <div className="flex flex-row gap-5 items-start justify-start">
        <div className="flex-1">
          <SprintDeck />
          <SprintCards />
        </div>
        <div>
          <Participants />
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";

import RoomCodeCopyBtn from "./RoomCodeCopyBtn";

import { useParams } from "next/navigation";
import Participants from "./Participants";
import SprintCards from "./sprint-cards";
import SprintDeck from "./sprint-deck";
import AddUserStory from "./add-user-story";
import { useCreateTeam } from "@/api/team/query";
import { setTeamInLocalStorage } from "@/utils/localStorage.utils";

export default function RoomCodeMain() {
  const params = useParams();
  const roomCode = params.roomCode;

  const createTeam = useCreateTeam();

  const handleCreateTeam = () => {
    if (!roomCode) return;

    createTeam.mutate(
      {
        room_code: roomCode as string,
      },
      {
        onSuccess: (response) => {
          setTeamInLocalStorage(response);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
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
        <div className="min-h-[60vh] flex-1 bg-accent shadow-md p-2 rounded flex flex-col items-center justify-evenly">
          <SprintDeck />
          <SprintCards />
        </div>
        <div className="flex flex-col gap-2">
          <Participants />
          <div className="bg-accent w-[320px] text-primary p-4 rounded shadow-md">
            <AddUserStory />
          </div>
        </div>
      </div>
    </div>
  );
}

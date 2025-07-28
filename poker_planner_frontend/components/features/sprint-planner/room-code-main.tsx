import React from "react";

import RoomCodeCopyBtn from "./room-code-copy-btn";

import Participants from "./participants-main";
import SprintCards from "./sprint-cards";
import SprintDeck from "./sprint-deck";
import SprintInfo from "./sprint-info";

export default function RoomCodeMain() {
  return (
    <div className="flex w-full flex-col gap-5 p-4">
      <div className="flex flex-row items-start justify-between gap-5">
        <SprintInfo />
        <RoomCodeCopyBtn />
      </div>
      <div className="flex flex-row items-start justify-start gap-5">
        <div className="bg-accent flex min-h-[60vh] flex-1 flex-col items-center justify-evenly rounded p-2 shadow-md">
          <SprintDeck />
          <SprintCards />
        </div>
        <div className="flex flex-col gap-2">
          <Participants />
        </div>
      </div>
    </div>
  );
}

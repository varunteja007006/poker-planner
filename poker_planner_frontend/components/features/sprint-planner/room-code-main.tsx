import React from "react";

import RoomCodeCopyBtn from "./room-code-copy-btn";

import Participants from "./participants-main";
import SprintCards from "./sprint-cards";
import SprintDeck from "./sprint-deck";

export default function RoomCodeMain() {
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
        </div>
      </div>
    </div>
  );
}

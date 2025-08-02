import React from "react";

import { ChartBarDefault } from "./sprint-points-barchart";
import RoomDisconnectBtn from "./room-disconnect-btn";
import { CommonStore } from "@/store/common/common.store";

export default function SprintInfo() {
  const storyPoints = CommonStore.useMetadata()?.storyPoints;

  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-5">
        {storyPoints?.length ? (
          <div className="flex h-10 items-center justify-center border px-4">
            Votes: {storyPoints?.length}
          </div>
        ) : null}
        <div>
          <ChartBarDefault />
        </div>
      </div>
      <div>
        <RoomDisconnectBtn />
      </div>
    </div>
  );
}

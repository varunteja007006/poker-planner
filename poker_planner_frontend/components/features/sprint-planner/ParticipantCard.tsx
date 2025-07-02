import React from "react";

import { CircleUserRound } from "lucide-react";

export default function ParticipantCard({ name }: { name: string }) {
  return (
    <div className="flex flex-row items-center gap-2 max-w-[200px] overflow-hidden">
      <CircleUserRound className="shrink-0" />
      <p className="truncate overflow-hidden text-ellipsis">{name} </p>
    </div>
  );
}

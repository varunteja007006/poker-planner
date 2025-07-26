import React from "react";

import { CircleUserRound } from "lucide-react";

import { cn } from "@/lib/utils";

export default function ParticipantCard({
  name,
  isActive,
  hasVoted,
}: {
  name: string;
  isActive: boolean;
  hasVoted: boolean;
}) {
  return (
    <div className="flex flex-row items-center justify-between gap-2 w-full overflow-hidden p-2 rounded-lg border border-primary/25 shadow bg-white dark:bg-black">
      <div className="flex flex-row items-center gap-2">
        <CircleUserRound className={cn("shrink-0")} />
        <p className="truncate overflow-hidden text-ellipsis">{name} </p>
      </div>
      <div>
        {isActive && (
          <div className="relative w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
          </div>
        )}
      </div>
      <div>{hasVoted && `👍`}</div>
    </div>
  );
}

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
    <div className="border-primary/25 flex w-full flex-row items-center justify-between gap-2 overflow-hidden rounded-lg border bg-white p-2 shadow dark:bg-black">
      <div className="flex flex-row items-center gap-2">
        <CircleUserRound className={cn("shrink-0")} />
        <p className="truncate overflow-hidden text-ellipsis">{name} </p>
      </div>
      <div>
        {isActive && (
          <div className="relative flex h-4 w-4 items-center justify-center rounded-full bg-green-400">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400"></span>
          </div>
        )}
      </div>
      <div>{hasVoted && `👍`}</div>
    </div>
  );
}

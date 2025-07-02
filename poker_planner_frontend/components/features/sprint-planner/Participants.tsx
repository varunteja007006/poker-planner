import React from "react";

import { Badge } from "@/components/ui/badge";

import ParticipantCard from "./ParticipantCard";

export default function Participants() {
  return (
    <div className="space-y-2 max-w-[270px] border border-primary/20 shadow-md hover:shadow-lg shadow-primary p-2 pl-3 rounded">
      <div className="flex flex-row gap-1 justify-between items-center">
        <p>Active Participants</p>
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          8
        </Badge>
      </div>
      <div className="w-full grid grid-cols-1 gap-1.5">
        {[1, 2, 3, 4, 5].map((participant) => (
          <ParticipantCard key={participant} name={participant.toString()} />
        ))}
      </div>
    </div>
  );
}

import React from "react";

import { Badge } from "@/components/ui/badge";

import ParticipantCard from "./participant-card";
import { useGetAllTeams } from "@/api/team/query";
import { useParams } from "next/navigation";

export default function Participants() {
  const params = useParams();
  const roomCode = params.roomCode;

  const teamMembers = useGetAllTeams({
    room_code: roomCode as string,
  });

  return (
    <div className="space-y-2 w-[320px] bg-accent shadow-md p-2 pl-3 rounded">
      <div className="flex flex-row gap-1 justify-between items-center">
        <p className="text-primary font-semibold text-lg">Participants</p>
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          {teamMembers.data?.length}
        </Badge>
      </div>
      <div className="w-full grid grid-cols-1 gap-1.5 max-h-[30vh] overflow-y-scroll scroll-p-2 scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/20">
        {teamMembers.data?.map((user) => (
          <ParticipantCard
            key={user.id}
            name={user.user.username}
            isActive={false} // Here it should be based on client
          />
        ))}
      </div>
    </div>
  );
}

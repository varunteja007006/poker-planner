import React from "react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      
      <ScrollArea className="h-[200px] w-full">
        {teamMembers.data?.map((user) => (
          <div key={user.id} className="mb-1 w-[95%]">
            <ParticipantCard
              name={user.user.username}
              isActive={false} // Here it should be based on client
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

import React from "react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import ParticipantCard from "./participant-card";

import { TeamStore } from "@/store/team/team.store";
import { StoriesPointsStore } from "@/store/story-points/story-points.store";

export default function Participants() {
  const team = TeamStore.useTeam();

  const storyPointsData = StoriesPointsStore.useStoryPointsData();

  return (
    <div className="w-[320px] space-y-2 rounded p-2 pl-3">
      <div className="flex flex-row items-center justify-between gap-1">
        <p className="text-primary text-lg font-semibold">Participants</p>
        <Badge className="mr-5 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          {team?.length}
        </Badge>
      </div>

      <ScrollArea className="h-[70vh] w-full">
        {team?.map((user) => {
          const storyPoint = storyPointsData?.find(
            (storyPoint) => storyPoint.user.username === user.user.username,
          );
          return (
            <div key={user.id} className="mb-1 w-[95%]">
              <ParticipantCard
                name={user.user.username}
                isOwner={user.is_room_owner}
                isActive={user.is_online} // Here it should be based on client
                hasVoted={storyPoint?.user.username === user.user.username}
              />
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}

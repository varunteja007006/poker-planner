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
    <div className="space-y-2 w-[320px] p-2 pl-3 rounded">
      <div className="flex flex-row gap-1 justify-between items-center">
        <p className="text-primary font-semibold text-lg">Participants</p>
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          {team?.length}
        </Badge>
      </div>

      <ScrollArea className="h-[70vh] w-full">
        {team?.map((user) => {
          const storyPoint = storyPointsData?.find(
            (storyPoint) => storyPoint.user.username === user.user.username
          );
          return (
            <div key={user.id} className="mb-1 w-[95%]">
              <ParticipantCard
                name={user.user.username}
                isActive={false} // Here it should be based on client
                hasVoted={storyPoint?.user.username === user.user.username}
              />
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}

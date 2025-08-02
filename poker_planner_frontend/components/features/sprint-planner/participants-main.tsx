import React from "react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import ParticipantCard from "./participant-card";

import { CommonStore } from "@/store/common/common.store";

export default function Participants() {
  const team = CommonStore.useMetadata()?.teamMembers;

  const storyPoints = CommonStore.useMetadata()?.storyPoints;

  return (
    <div className="w-[320px] space-y-2 rounded p-2 pl-3">
      <div className="flex flex-row items-center justify-between gap-1">
        <p className="text-primary text-lg font-semibold">Participants</p>
        <Badge className="mr-5 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          {team?.length}
        </Badge>
      </div>

      <ScrollArea className="h-[70vh] w-full">
        {team
          ?.sort((a, _) => (a.is_room_owner ? -1 : 1))
          ?.map((user) => {
            return (
              <div key={user.id} className="mb-1 w-[95%]">
                <ParticipantCard
                  name={user.user.username}
                  isOwner={user.is_room_owner}
                  isActive={user.is_online}
                  hasVoted={
                    storyPoints?.some(
                      (storyPoint) =>
                        storyPoint.user.username === user.user.username,
                    ) ?? false
                  }
                />
              </div>
            );
          })}
      </ScrollArea>
    </div>
  );
}

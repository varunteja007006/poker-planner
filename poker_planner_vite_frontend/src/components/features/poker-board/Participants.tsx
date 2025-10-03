import React from "react";

import { useQuery } from "convex/react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useUserStore } from "@/store/user.store";
import { useParams } from "react-router";
import usePresence from "@convex-dev/presence/react";

import ParticipantCard from "./ParticipantCard";

const findUserStoryPoint = (
  userId: string,
  list: {
    userId: string;
    isCurrentUser: boolean;
    storyPoint: string | number | undefined;
  }[]
) => {
  return list.find((item) => item.userId === userId);
};

export default function Participants({
  storyId,
}: Readonly<{
  storyId: Id<"stories"> | null;
}>) {
  const params = useParams();
  const roomCode = params?.roomCode;

  const { user, userToken } = useUserStore();

  const presenceState = usePresence(
    api.presence,
    roomCode ?? "unknown-room",
    user?.id!
  );

  const roomStoryPoints = useQuery(
    api.storyPoints.getStoryPoints,
    storyId && userToken ? { storyId, token: userToken } : "skip"
  );

  const updatedRoomStoryPoints = React.useMemo(
    () =>
      roomStoryPoints?.success && roomStoryPoints.storyPoints
        ? roomStoryPoints.storyPoints.map((item) => ({
            userId: item.userId,
            isCurrentUser: item.isCurrentUser,
            storyPoint: item.story_point,
          }))
        : [],
    [roomStoryPoints]
  );

  const participantList = React.useMemo(
    () =>
      presenceState?.map((p) => {
        const foundUser = findUserStoryPoint(p.userId, updatedRoomStoryPoints);
        return {
          ...p,
          isCurrentUser: foundUser?.isCurrentUser,
          hasVoted: !!foundUser?.userId,
        };
      }) ?? [],
    [presenceState, updatedRoomStoryPoints]
  );

  if (!presenceState) {
    return null;
  }

  return (
    <div className="space-y-2">
      {participantList.map((user) => {
        return (
          <ParticipantCard
            key={user.userId}
            name={user.name ?? "Unknown User"}
            online={user.online}
            hasVoted={user?.hasVoted}
            lastDisconnected={user.lastDisconnected}
            emojiId={user.userId}
          />
        );
      })}
    </div>
  );
}

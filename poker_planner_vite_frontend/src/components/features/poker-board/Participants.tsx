import { useQuery } from "convex/react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useUserStore } from "@/store/user.store";
import { useParams } from "react-router";
import ParticipantCard from "./ParticipantCard";

const findUserStoryPoint = (
  userId: Id<"users">,
  list: {
    userId: Id<"users">;
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
  const { userToken } = useUserStore();

  const roomTeamMembers = useQuery(
    api.presence.getActiveUsersInRoom,
    roomCode && userToken
      ? {
          roomCode,
          userToken,
        }
      : "skip"
  );

  const roomStoryPoints = useQuery(
    api.storyPoints.getStoryPoints,
    storyId && userToken ? { storyId, token: userToken } : "skip"
  );

  const updatedRoomStoryPoints =
    roomStoryPoints?.success && roomStoryPoints.storyPoints
      ? roomStoryPoints.storyPoints.map((item) => ({
          userId: item.userId,
          isCurrentUser: item.isCurrentUser,
          storyPoint: item.story_point,
        }))
      : [];

  if (!roomTeamMembers?.success) {
    return null;
  }

  if (roomTeamMembers.success) {
    return (
      <div className="space-y-2">
        {roomTeamMembers.users.map((user) => {
          const hasVoted = findUserStoryPoint(user.id, updatedRoomStoryPoints);
          return (
            <ParticipantCard
              key={user.id}
              name={user.username}
              hasVoted={!!hasVoted?.userId}
              isActive={user.isActive}
            />
          );
        })}
      </div>
    );
  }
}

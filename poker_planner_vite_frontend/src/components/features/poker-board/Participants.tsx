import { useQuery } from "convex/react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useUserStore } from "@/store/user.store";

export default function Participants({
  storyId,
}: Readonly<{
  storyId: Id<"stories"> | null;
}>) {
  const { userToken } = useUserStore();

  const roomStoryPoints = useQuery(
    api.storyPoints.getRoomStoryVotes,
    storyId && userToken ? { storyId, token: userToken } : "skip"
  );

  if (!roomStoryPoints?.success) {
    return null;
  }

  return (
    <div>
      {roomStoryPoints?.storyPoints?.map((item) => {
        return JSON.stringify(item, null, 3);
      })}
    </div>
  );
}

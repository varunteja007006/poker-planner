import React from "react";

import { toast } from "sonner";

import { v4 as uuidv4 } from "uuid";
import { useCreateStory, useUpdateStory } from "@/api/stories/query";
import { useParams } from "next/navigation";
import { useSocketContext } from "@/providers/socket-provider";
import { StoriesStore } from "@/store/stories/stories.store";
import { StoryPointEvaluationStatus } from "@/types/story.types";
import { CommonStore } from "@/store/common/common.store";

export default function SprintDeck() {
  const params = useParams();
  const roomCode = params.roomCode as string;

  const useCommonStoreMetadata = CommonStore.useMetadata();
  const myTeamRecord = useCommonStoreMetadata?.team;

  const { socket } = useSocketContext();

  const story = StoriesStore.useStory();

  const [revealScore, setRevealScore] = React.useState<boolean>(false);

  const createStory = useCreateStory();
  const updateStory = useUpdateStory();

  const [isPending, startTransition] = React.useTransition();

  const handleCreateStory = async () => {
    if (!roomCode) {
      toast.error("Room code not found");
      return;
    }

    const payload = {
      title: "Story__" + uuidv4(),
      description: "Description__" + uuidv4(),
      room_code: roomCode,
      story_point_evaluation_status:
        "in progress" as StoryPointEvaluationStatus,
    };

    createStory.mutate(payload, {
      onSuccess: (response) => {
        toast.success("Started the game successfully");
        socket?.emit("stories:create", response);
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to start the game");
      },
    });
  };

  const handleUpdateStory = async () => {
    if (!story || !story.id) {
      toast.error("Unable to process the game");
      return;
    }

    updateStory.mutate(
      {
        id: story.id,
        story_point_evaluation_status: "completed",
      },
      {
        onSuccess: (response) => {
          if (!response) {
            toast.error("Failed to update the game");
            return;
          }

          const newStory = {
            ...story,
            story_point_evaluation_status: "completed",
          };
          toast.success("Game ended successfully");
          socket?.emit("stories:update", newStory);
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to end the game");
        },
      },
    );
  };

  const handleScoreToggle = async (newPrev: boolean) => {
    setRevealScore(newPrev);
    startTransition(() =>
      newPrev ? handleCreateStory() : handleUpdateStory(),
    );
  };

  React.useEffect(() => {
    if (story) {
      setRevealScore(story.story_point_evaluation_status === "in progress");
    }
  }, [story]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="bg-primary-foreground text-primary hover:bg-primary-foreground/80 h-[50px] w-[140px] cursor-pointer rounded-lg p-2 transition-all disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => handleScoreToggle(!revealScore)}
        disabled={isPending || !myTeamRecord?.is_room_owner}
      >
        {revealScore ? "End Game" : "Start Game"}
      </button>

      {!!myTeamRecord && (
        <p className="text-sm">
          {myTeamRecord?.is_room_owner
            ? "You can start the game"
            : "Only owner can start the game"}
        </p>
      )}
    </div>
  );
}

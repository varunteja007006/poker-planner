import React from "react";

import { toast } from "sonner";

import { v4 as uuidv4 } from "uuid";
import { useCreateStory, useUpdateStory } from "@/api/stories/query";
import { useParams } from "next/navigation";
import { getStoryFromLocalStorage } from "@/utils/localStorage.utils";
import { useSocketContext } from "@/providers/socket-provider";
import { StoriesStore } from "@/store/stories/stories.store";
import { useAppContext } from "@/providers/app-provider";

export default function SprintDeck() {
  const params = useParams();
  const roomCode = params.roomCode as string;

  const { userTeam } = useAppContext();

  const { socket } = useSocketContext();

  const story = StoriesStore.useStory();

  const [revealScore, setRevealScore] = React.useState<boolean>(false);

  const createStory = useCreateStory();
  const updateStory = useUpdateStory();

  const [isPending, startTransition] = React.useTransition();

  const handleCreateStory = async () => {

    // await new Promise((resolve) => setTimeout(resolve, 10000));

    if (!roomCode) {
      toast.error("Room code not found");
      return;
    }

    const payload = {
      title: "Story__" + uuidv4(),
      description: "Description__" + uuidv4(),
      room_code: roomCode,
      story_point_evaluation_status: "in progress" as
        | "in progress"
        | "pending"
        | "completed",
    };

    createStory.mutate(payload, {
      onSuccess: (response) => {
        toast.success("Story created successfully");
        socket?.emit("stories:create", response);
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to create story");
      },
    });
  };

  const handleUpdateStory = async () => {
    const story = getStoryFromLocalStorage();

    if (!story || !story.id) {
      toast.error("Story not found");
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
            toast.error("Failed to update story");
            return;
          }

          let newStory = {
            ...story,
            story_point_evaluation_status: "completed",
          };
          toast.success("Story updated successfully");
          socket?.emit("stories:update", newStory);
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to update story");
        },
      }
    );
  };

  const handleScoreToggle = async (newPrev: boolean) => {
    setRevealScore(newPrev);
    startTransition(() =>
      newPrev ? handleCreateStory() : handleUpdateStory()
    );
  };

  React.useEffect(() => {
    if (story) {
      setRevealScore(story.story_point_evaluation_status === "in progress");
    }
  }, [story]);

  return (
    <div>
      <button
        className="disabled:opacity-50 disabled:cursor-not-allowed w-[140px] h-[50px] rounded-lg bg-primary-foreground text-primary cursor-pointer hover:bg-primary-foreground/80 transition-all p-2"
        onClick={() => handleScoreToggle(!revealScore)}
        disabled={isPending || !userTeam?.is_room_owner}
      >
        {revealScore ? "Reveal" : "Start"}
      </button>
    </div>
  );
}

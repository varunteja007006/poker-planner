import React from "react";

import { toast } from "sonner";

import { useParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useUserStore } from "../../store/user.store";
import PokerCards from "./poker-board/PokerCards";
import Participants from "./poker-board/Participants";
import PokerResults from "./poker-board/PokerResults";
import PokerBoardHeader from "./poker-board/PokerBoardHeader";

export default function PokerBoard() {
  const params = useParams();
  const roomCode = params?.roomCode ?? "";

  const { userToken, user } = useUserStore();

  const [storyId, setStoryId] = React.useState<Id<"stories"> | null>(null);
  const prevStartedStoryRef = React.useRef<any>(undefined);

  const startedStory = useQuery(api.stories.getStartedStory, {
    userToken,
    roomCode,
  });

  const createMutation = useMutation(api.stories.createStory);
  const completeMutation = useMutation(api.stories.completeStory);

  React.useEffect(() => {
    if (
      startedStory !== undefined &&
      prevStartedStoryRef.current !== undefined
    ) {
      const prevActive =
        prevStartedStoryRef.current?.success &&
        !!prevStartedStoryRef.current?.story;
      const currentActive = startedStory.success && !!startedStory.story;
      if (prevActive !== currentActive) {
        if (currentActive) {
          toast.success("Game started!");
        } else {
          toast.success("Game completed!");
        }
      }
    }
    if (startedStory?.success && startedStory.story) {
      setStoryId(startedStory.story._id);
    } else {
      setStoryId(null);
    }
    prevStartedStoryRef.current = startedStory;
  }, [startedStory]);

  const handleClick = async () => {
    if (!userToken || !roomCode || startedStory === undefined) return;

    if (startedStory?.success && startedStory.story) {
      // Stop the story
      await completeMutation({ storyId: startedStory.story._id, userToken });
      setStoryId(null);
    } else {
      // Start a new story
      const result = await createMutation({ roomCode, userToken });
      if (result.success && result.storyId) {
        setStoryId(result.storyId);
      }
    }
  };

  let hasActiveStory = null;
  let buttonText = "Loading...";
  if (startedStory !== undefined) {
    hasActiveStory = startedStory.success && startedStory.story;
    buttonText = hasActiveStory ? "Stop" : "Start";
  }
  const isDisabled = !userToken || !roomCode || startedStory === undefined;

  if (!user?.id) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4 md:flex-row px-4 py-2">
      <div className="flex flex-col w-full gap-4">
        <PokerBoardHeader />

        <div className="flex-1 flex flex-col items-center justify-center min-h-[280px] gap-10 bg-card rounded-md border">
          <button
            onClick={handleClick}
            disabled={isDisabled}
            className="bg-white dark:bg-secondary dark:border-primary/50 shadow font-bold border hover:shadow-lg text-primary hover:dark:border-primary hover:bg-primary-foreground/80 h-[50px] w-[140px] cursor-pointer rounded-lg p-2 transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            {buttonText}
          </button>

          <PokerCards storyId={storyId} />
        </div>

        <PokerResults storyId={storyId} />
      </div>

      <div className="w-xs">
        <Participants storyId={storyId} />
      </div>
    </div>
  );
}

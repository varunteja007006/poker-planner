import React from "react";

import { Button } from "../ui/button";

import { Copy } from "lucide-react";

import { toast } from "sonner";

import { useParams } from "react-router";
import CopyBtn from "../atoms/CopyBtn";
import PokerCards from "./poker-board/PokerCards";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useUserStore } from "../../store/user.store";
import Participants from "./poker-board/Participants";

export default function PokerBoard() {
  const params = useParams();
  const roomCode = params?.roomCode ?? "";

  const { userToken } = useUserStore();

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

  return (
    <div className="p-2 flex flex-col gap-4 w-full">
      <div className="w-full flex justify-end gap-2 items-center">
        <Button variant={"secondary"}>View Results</Button>
        <Button variant={"destructive"}>Leave Room</Button>
        <CopyBtn text={roomCode}>
          <Copy className="mr-2" />
          Copy Room Code
        </CopyBtn>
      </div>
      <div className="w-full flex flex-col gap-4 md:flex-row ">
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] gap-10 bg-accent">
          <button
            onClick={handleClick}
            disabled={isDisabled}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/80 h-[50px] w-[140px] cursor-pointer rounded-lg p-2 transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            {buttonText}
          </button>

          <div>
            <PokerCards storyId={storyId} />
          </div>
        </div>
        <div className="w-xs">
          <Participants storyId={storyId} />
        </div>
      </div>
    </div>
  );
}

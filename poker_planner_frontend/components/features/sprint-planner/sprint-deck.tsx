import React from "react";

import { toast } from "sonner";

import { v4 as uuidv4 } from "uuid";
import { useCreateStory, useUpdateStory } from "@/api/stories/query";
import { useParams } from "next/navigation";
import {
  getStoryFromLocalStorage,
  getTeamFromLocalStorage,
  setStoryInLocalStorage,
} from "@/utils/localStorage.utils";
import { Team } from "@/types/team.types";
import { useSocketContext } from "@/providers/socket-provider";
import { Story } from "@/types/story.types";

export default function SprintDeck() {
  const params = useParams();
  const roomCode = params.roomCode as string;
  const { socket } = useSocketContext();

  const [team, setTeam] = React.useState<Team | null>(null);
  const [revealScore, setRevealScore] = React.useState<boolean>(false);

  const createStory = useCreateStory();
  const updateStory = useUpdateStory();

  const [isPending, startTransition] = React.useTransition();

  const handleCreateStory = async () => {
    if (!roomCode) {
      toast.error("Room code not found");
      return;
    }

    createStory.mutate(
      {
        title: "Story__" + uuidv4(),
        description: "Description__" + uuidv4(),
        room_code: roomCode,
        story_point_evaluation_status: "in progress",
      },
      {
        onSuccess: (response) => {
          toast.success("Story created successfully");
          socket?.emit("stories:create", response);
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to create story");
        },
      }
    );
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
          toast.success("Story updated successfully");
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
    const team = getTeamFromLocalStorage();
    if (team) {
      setTeam(team);
    }
  }, []);

  React.useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(
      "stories:created",
      (response: { clientId: string; message: string; body: Story }) => {
        toast.success(response.message);
        console.log(response);
        setStoryInLocalStorage(response.body);
        const isStoryInProgress =
          response.body.story_point_evaluation_status === "in progress";
        if (isStoryInProgress) {
          setRevealScore(true);
        }
      }
    );

    return () => {
      socket.off("stories:created");
    };
  }, [socket]);

  return (
    <div>
      <button
        className="disabled:opacity-50 disabled:cursor-not-allowed w-[140px] h-[50px] rounded-lg bg-primary-foreground text-primary cursor-pointer hover:bg-primary-foreground/80 transition-all p-2"
        onClick={() => handleScoreToggle(!revealScore)}
        disabled={isPending || !team?.is_room_owner}
      >
        {revealScore ? "Reveal" : "Start"}
      </button>
    </div>
  );
}

const UserCard = () => {
  return (
    <div className="w-[80px] h-[100px] rounded-lg bg-accent text-accent-foreground p-2">
      User
    </div>
  );
};

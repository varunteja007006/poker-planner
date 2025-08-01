import React from "react";

import { cn } from "@/lib/utils";
import { Coffee } from "lucide-react";
import { useSocketContext } from "@/providers/socket-provider";
import { StoriesStore } from "@/store/stories/stories.store";
import { useParams } from "next/navigation";
import { StoriesPointsStore } from "@/store/story-points/story-points.store";
import { useAppContext } from "@/providers/app-provider";

const sprintCards = [
  {
    name: "1",
    value: 1,
  },

  {
    name: "2",
    value: 2,
  },
  {
    name: "3",
    value: 3,
  },
  {
    name: "5",
    value: 5,
  },
  {
    name: "8",
    value: 8,
  },
  {
    name: "13",
    value: 13,
  },
  {
    name: "21",
    value: 21,
  },
  {
    name: <Coffee />,
    value: 0,
  },
];

export default function SprintCards() {
  const roomCode = useParams()?.roomCode;

  const { socket } = useSocketContext();

  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);

  const story = StoriesStore.useStory();

  const storyPointsData = StoriesPointsStore.useStoryPointsData();

  const { user } = useAppContext();

  const onClick = (value: number) => {
    setSelectedCard(value);

    if (socket && story?.story_point_evaluation_status === "in progress") {
      socket.emit("story-points:create", {
        story_point: value,
        story_id: story.id,
        token: user?.user_token,
        room_code: roomCode,
      });
    }
  };

  const btnDisabled = story?.story_point_evaluation_status !== "in progress";

  React.useEffect(() => {
    if (socket) {
      socket.on("stories:created", () => {
        setSelectedCard(null);
      });
    }

    return () => {
      if (socket) {
        socket.off("stories:created");
      }
    };
  }, [socket]);

  React.useEffect(() => {
    if (storyPointsData) {
      const storyPoint = storyPointsData.find(
        (storyPoint) => storyPoint.user.username === user?.username,
      );
      if (storyPoint) {
        setSelectedCard(storyPoint?.story_point);
      }
    }
  }, [storyPointsData, user?.username]);

  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-5">
      {sprintCards.map((card) => (
        <button
          key={card.value}
          className={cn(
            "bg-primary-foreground border-primary/30 flex h-[80px] w-[60px] scale-[0.9] cursor-pointer flex-col items-center justify-center rounded-lg border transition-all hover:scale-[1] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50",
            selectedCard === card.value && "bg-primary text-primary-foreground",
          )}
          onClick={() => onClick(card.value)}
          disabled={btnDisabled}
        >
          {card.name}
        </button>
      ))}
    </div>
  );
}

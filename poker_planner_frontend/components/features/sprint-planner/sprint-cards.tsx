import React from "react";

import { cn } from "@/lib/utils";
import { Coffee } from "lucide-react";
import { useSocketContext } from "@/providers/socket-provider";
import { useParams } from "next/navigation";
import { useAppContext } from "@/providers/app-provider";
import { CommonStore } from "@/store/common/common.store";
import { StoryPoint } from "@/types/story-points.types";

const STORY_POINTS_CARDS = [
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

  const { socket, emitMetadata } = useSocketContext();
  const { user } = useAppContext();

  const story = CommonStore.useMetadata()?.inProgressStory;
  const storyPoints = CommonStore.useMetadata()?.storyPoints;

  const storyPoint = storyPoints?.find(
    (storyPoint) => storyPoint.user.username === user?.username,
  );

  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);

  const btnDisabled = story?.story_point_evaluation_status !== "in progress";

  // create a story point
  const onClick = async (value: number) => {
    setSelectedCard(value);

    if (socket && story?.story_point_evaluation_status === "in progress") {
      const payload = {
        story_point: value,
        story_id: story.id,
        token: user?.user_token,
        room_code: roomCode,
      };

      await new Promise((resolve, reject) => {
        try {
          socket.emit(
            "story-points:create",
            payload,
            (response: StoryPoint) => {
              emitMetadata(() => {
                resolve(response);
              });
            },
          );
        } catch (error) {
          reject(error);
        }
      });
    }
  };

  // Whenever a story is created reset the selected card
  React.useEffect(() => {
    if (socket) {
      socket.on("story:created", () => {
        setSelectedCard(null);
      });
    }

    return () => {
      if (socket) {
        socket.off("story:created");
      }
    };
  }, [socket]);

  // Whenever a story point is created update the selected card
  React.useEffect(() => {
    if (storyPoint?.id) {
      setSelectedCard(storyPoint?.story_point);
    }
  }, [storyPoint?.id]);

  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-5">
      {STORY_POINTS_CARDS.map((card) => (
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

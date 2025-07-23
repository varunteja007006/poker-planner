import React from "react";

import { cn } from "@/lib/utils";
import { Coffee } from "lucide-react";
import { useSocketContext } from "@/providers/socket-provider";
import { getUserFromLocalStorage } from "@/utils/localStorage.utils";
import { StoriesStore } from "@/store/stories/stories.store";
import { useParams } from "next/navigation";

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

  const user = getUserFromLocalStorage();

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

  return (
    <div className="flex flex-row flex-wrap gap-5 items-center justify-center">
      {sprintCards.map((card) => (
        <button
          key={card.value}
          className={cn(
            "disabled:opacity-50 disabled:cursor-not-allowed w-[60px] h-[80px] scale-[0.9] hover:shadow-md rounded-lg bg-primary-foreground hover:scale-[1] transition-all border border-primary/30 flex flex-col items-center justify-center cursor-pointer",
            selectedCard === card.value && "bg-primary text-primary-foreground"
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

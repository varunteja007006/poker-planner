import React from "react";



import { cn } from "@/lib/utils";
import { Coffee } from "lucide-react";

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
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);

  const onClick = (value: number) => {
    setSelectedCard(value);
  };

  return (
    <div className="flex flex-row flex-wrap gap-5 items-center justify-center">
      {sprintCards.map((card) => (
        <button
          key={card.value}
          className={cn(
            "w-[60px] h-[80px] scale-[0.9] hover:shadow-md rounded-lg bg-primary-foreground hover:scale-[1] transition-all border border-primary/30 flex flex-col items-center justify-center cursor-pointer",
            selectedCard === card.value && "bg-primary text-primary-foreground"
          )}
          onClick={() => onClick(card.value)}
        >
          {card.name}
        </button>
      ))}
    </div>
  );
}

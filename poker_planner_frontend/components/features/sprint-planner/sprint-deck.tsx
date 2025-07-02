import React from "react";

export default function SprintDeck() {
  const [revealScore, setRevealScore] = React.useState<boolean>(false);

  return (
    <div className="">
      <div>
        <button
          className="w-[140px] h-[50px] rounded-lg bg-primary-foreground text-primary cursor-pointer hover:bg-primary-foreground/80 transition-all p-2"
          onClick={() => setRevealScore(!revealScore)}
        >
          {revealScore ? "Start" : "Reveal"}
        </button>
      </div>
    </div>
  );
}

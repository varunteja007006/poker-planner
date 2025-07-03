import React from "react";

export default function SprintDeck() {
  const [revealScore, setRevealScore] = React.useState<boolean>(false);

  return (
    <div className="grid grid-cols-5 gap-2 items-center justify-items-center">
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
      <div>
        <button
          className="w-[140px] h-[50px] rounded-lg bg-primary-foreground text-primary cursor-pointer hover:bg-primary-foreground/80 transition-all p-2"
          onClick={() => setRevealScore(!revealScore)}
        >
          {revealScore ? "Start" : "Reveal"}
        </button>
      </div>

      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
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

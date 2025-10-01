import { useParams } from "react-router";
import CopyBtn from "../atoms/CopyBtn";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import PokerCards from "./poker-board/PokerCards";
import React from "react";
import type { Id } from "../../../convex/_generated/dataModel";

export default function PokerBoard() {
  const params = useParams();
  const roomCOde = params?.roomCode ?? "";

  const [storyId, setStoryId] = React.useState<Id<"stories"> | null>(null);

  return (
    <div className="p-2 flex flex-col gap-4 w-full">
      <div className="w-full flex justify-end gap-2 items-center">
        <Button variant={"secondary"}>View Results</Button>
        <Button variant={"destructive"}>Leave Room</Button>
        <CopyBtn text={roomCOde}>
          <Copy className="mr-2" />
          Copy Room Code
        </CopyBtn>
      </div>
      <div className="w-full flex flex-col gap-4 md:flex-row ">
        <div className="flex-1">
          Board
          <div>
            <PokerCards storyId={storyId} />
          </div>
        </div>
        <div className="min-w-xs"></div>
      </div>
    </div>
  );
}

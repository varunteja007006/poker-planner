"use client";
import React from "react";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import Participants from "./Participants";
import SprintCards from "./sprint-cards";
import SprintDeck from "./sprint-deck";

export default function RoomCodeMain() {
  const params = useParams();
  const roomCode = params.roomCode;

  const handleCopyRoomCode = () => {
    try {
      navigator.clipboard.writeText(roomCode as string);
      toast.success("Room code copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy room code");
      console.error("Failed to copy room code: ", error);
    }
  };

  return (
    <div className="p-4 flex flex-col w-full gap-5">
      <div className="flex flex-row items-start justify-between gap-2">
        <div></div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"default"}
                className="cursor-pointer"
                onClick={handleCopyRoomCode}
              >
                Room Code: {roomCode}
                <span className="ml-2">
                  <Copy />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy Room Code</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-row gap-5 items-start justify-start">
        <div className="flex-1">
          <SprintDeck />
          <SprintCards />
        </div>
        <div className="">
          <Participants />
        </div>
      </div>
    </div>
  );
}

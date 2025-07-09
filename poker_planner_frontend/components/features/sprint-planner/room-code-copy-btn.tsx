import React from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { Copy } from "lucide-react";

import { useParams } from "next/navigation";

export default function RoomCodeCopyBtn() {
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
  );
}

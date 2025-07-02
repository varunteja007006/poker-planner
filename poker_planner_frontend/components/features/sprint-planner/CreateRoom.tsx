"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Dices } from "lucide-react";

import { useRouter } from "next/navigation";
import { generateRandomRoomCode } from "@/utils/utils";
import { Label } from "@/components/ui/label";

export default function CreateRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = React.useState(generateRandomRoomCode());

  const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && value.length > 100) {
      return;
    }

    setRoomCode(event.target.value);
  };

  const handleSubmit = () => {
    console.log(roomCode);
    router.push(`/room/${roomCode}`);
  };

  const onGenerateRoomCode = () => {
    setRoomCode(generateRandomRoomCode());
  };

  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto">
      <Label
        className="text-primary"
        htmlFor="roomCode"
      >{`> Create Room`}</Label>
      <div className="flex items-center gap-2">
        <Input
          name="roomCode"
          placeholder="Room code"
          value={roomCode}
          onChange={handleRoomCodeChange}
          readOnly
          className="cursor-default"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"default"}
              size={"icon"}
              onClick={onGenerateRoomCode}
              className="cursor-pointer"
            >
              <Dices />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate Room Code</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Button
        variant={"default"}
        onClick={handleSubmit}
        className="cursor-pointer"
      >
        Create
      </Button>
    </div>
  );
}

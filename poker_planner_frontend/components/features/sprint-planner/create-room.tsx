"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { Dices } from "lucide-react";

import { Room } from "@/types/room.types";

import { useRouter } from "next/navigation";
import { generateRandomRoomCode } from "@/utils/utils";
import { useCreateRoom } from "@/api/room/query";
import { useAppContext } from "@/providers/app-provider";

export default function CreateRoom() {
  const router = useRouter();

  const { user } = useAppContext();

  const [roomCode, setRoomCode] = React.useState(generateRandomRoomCode());

  const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && value.length > 100) {
      return;
    }

    setRoomCode(event.target.value);
  };

  const createRoom = useCreateRoom();

  const handleSubmit = () => {
    if (!user?.id || !user.user_token) {
      toast.error("User not found");
      return;
    }

    createRoom.mutate(
      { room_code: roomCode },
      {
        onSuccess: () => {
          toast.success("Room created successfully");
          router.push(`/room/${roomCode}`);
        },
        onError: (error) => {
          console.error(error);
          toast.error("Something went wrong with creating the room");
        },
      },
    );
  };

  const onGenerateRoomCode = () => {
    setRoomCode(generateRandomRoomCode());
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-2">
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

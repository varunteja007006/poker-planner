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

import { useRouter } from "next/navigation";
import { generateRandomRoomCode } from "@/utils/utils";
import { useCreateRoom } from "@/api/room/query";
import { Room } from "@/types/room.types";
import { useAppContext } from "@/providers/app-provider";

export default function CreateRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = React.useState(generateRandomRoomCode());
  const { user, handleSetRoom } = useAppContext();

  const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && value.length > 100) {
      return;
    }

    setRoomCode(event.target.value);
  };

  const createRoom = useCreateRoom();

  const handleSubmit = () => {
    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    createRoom.mutate(
      { room_code: roomCode, user_id: Number(user?.id) },
      {
        onSuccess: (response: Room) => {
          handleSetRoom(response);
          toast.success("Room created successfully");
          router.push(`/room/${roomCode}`);
        },
        onError: (error) => {
          console.log(error);
          toast.error("Something went wrong with creating the room");
        },
      }
    );
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

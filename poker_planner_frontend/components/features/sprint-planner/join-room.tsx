"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import RoomApi from "@/api/room/api";
import { toast } from "sonner";

export default function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = React.useState("");

  const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && value.length > 100) {
      return;
    }

    setRoomCode(event.target.value);
  };

  const handleSubmit = async () => {
    if (!roomCode) {
      toast.error("Room code is required");
      return;
    }

    const data = await RoomApi.getAllRooms({ room_code: roomCode });

    if (data.length > 0 && data[0].room_code === roomCode) {
      router.push(`/room/${roomCode}`);
    } else {
      toast.error("Room not found");
    }
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-2">
      <Label className="text-primary" htmlFor="roomCode">{`> Join Room`}</Label>
      <Input
        name="roomCode"
        placeholder="Room code"
        value={roomCode}
        onChange={handleRoomCodeChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <Button
        variant={"default"}
        onClick={handleSubmit}
        className="cursor-pointer"
      >
        Join
      </Button>
    </div>
  );
}

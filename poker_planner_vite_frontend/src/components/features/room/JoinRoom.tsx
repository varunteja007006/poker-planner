"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/user.store";
import { useJoinRoom } from "@/hooks/useJoinRoom";

export default function JoinRoom() {
  const { userToken } = useUserStore();
  const { joinRoom, isJoining } = useJoinRoom();

  const [roomCode, setRoomCode] = React.useState("");

  const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && value.length > 100) {
      return;
    }
    setRoomCode(event.target.value);
  };

  const handleSubmit = async () => {
    await joinRoom(roomCode);
  };

  return (
    <div className="w-sm lg:w-md space-y-2">
      <Label className="font-semibold text-primary" htmlFor="roomCode">{`Join Room`}</Label>
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
        disabled={isJoining}
      />
      <Button
        onClick={handleSubmit}
        disabled={!userToken || isJoining}
        className="cursor-pointer w-full"
      >
        {isJoining ? "Joining..." : "Join"}
      </Button>
    </div>
  );
}

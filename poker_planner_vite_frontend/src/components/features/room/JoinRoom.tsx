"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { useConvex } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function JoinRoom() {
  const navigate = useNavigate();
  const convex = useConvex();

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

    const result = await convex.query(api.rooms.checkRoomExists, { roomCode });

    if (result.success) {
      navigate(`/room/${roomCode}`);
    } else {
      toast.error(result.message);
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

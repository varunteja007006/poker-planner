"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { useConvex } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUserStore } from "@/store/user.store";

export default function JoinRoom() {
  const navigate = useNavigate();
  const convex = useConvex();

  const { userToken } = useUserStore();

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

    if (!userToken) {
      toast.error("User not authenticated");
      return;
    }

    const checkResult = await convex.query(api.rooms.checkRoomExists, { roomCode });

    if (!checkResult.success) {
      toast.error(checkResult.message);
      return;
    }

    const joinResult = await convex.mutation(api.rooms.joinRoom, {
      roomCode,
      userToken
    });

    if (joinResult.success) {
      toast.success(joinResult.message);
      navigate(`/room/${roomCode}`);
    } else {
      toast.error(joinResult.message);
    }
  };

  return (
    <div className="w-sm lg:w-md space-y-2">
      <Label className="font-semibold" htmlFor="roomCode">{`Join Room`}</Label>
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
        onClick={handleSubmit}
        disabled={!userToken}
        className="cursor-pointer w-full"
      >
        Join
      </Button>
    </div>
  );
}

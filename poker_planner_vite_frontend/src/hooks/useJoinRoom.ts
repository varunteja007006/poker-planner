"use client";

import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useUserStore } from "@/store/user.store";
import { useState } from "react";

export function useJoinRoom() {
  const convex = useConvex();
  const navigate = useNavigate();
  const { userToken } = useUserStore();
  const [isJoining, setIsJoining] = useState(false);

  const joinRoom = async (roomCode: string) => {
    if (!roomCode) {
      toast.error("Room code is required");
      return false;
    }

    if (!userToken) {
      toast.error("User not authenticated");
      return false;
    }

    setIsJoining(true);

    try {
      const checkResult = await convex.query(api.rooms.checkRoomExists, {
        roomCode,
      });

      if (!checkResult.success) {
        toast.error(checkResult.message);
        return false;
      }

      const joinResult = await convex.mutation(api.rooms.joinRoom, {
        roomCode,
        userToken,
      });

      if (joinResult.success) {
        toast.success(joinResult.message);
        navigate(`/room/${roomCode}`);
        return true;
      } else {
        toast.error(joinResult.message);
        return false;
      }
    } catch (error) {
      toast.error("Failed to join room");
      console.error(error);
      return false;
    } finally {
      setIsJoining(false);
    }
  };

  return { joinRoom, isJoining };
}

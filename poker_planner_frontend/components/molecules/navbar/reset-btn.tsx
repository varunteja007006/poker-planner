"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

import { clearLocalStorage } from "@/utils/localStorage.utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/providers/app-provider";

export default function ResetBtn() {
  const router = useRouter();

  const { handleSetUser, handleSetUserTeam, handleSetRoom } = useAppContext();

  const resetBtn = () => {
    clearLocalStorage();
    toast.success("Account reset successful");
    window.location.href = "/";
    handleSetUser(null);
    handleSetUserTeam(null);
    handleSetRoom(null);
  };

  return (
    <Button
      onClick={resetBtn}
      variant="outline"
      size="icon"
      className="cursor-pointer"
    >
      <Power />
    </Button>
  );
}

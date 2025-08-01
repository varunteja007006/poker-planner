"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

import { clearLocalStorage } from "@/utils/localStorage.utils";
import { toast } from "sonner";
import { useAppContext } from "@/providers/app-provider";

export default function ResetBtn() {
  const { handleSetUser, handleSetUserTeam, handleSetRoom } = useAppContext();

  const resetBtn = () => {
    clearLocalStorage();
    handleSetUser(null);
    handleSetUserTeam(null);
    handleSetRoom(null);
    toast.success("Account reset successful");
    window.location.href = "/";
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

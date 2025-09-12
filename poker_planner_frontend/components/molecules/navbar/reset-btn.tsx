"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

import { performReset } from "@/utils/localStorage.utils";
import { toast } from "sonner";
import { useAppContext } from "@/providers/app-provider";

export default function ResetBtn() {
  const { handleSetUser } = useAppContext();

  const resetBtn = () => {
    handleSetUser(null);
    toast.success("Account reset successful");
    performReset();
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

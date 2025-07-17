"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

import { clearLocalStorage } from "@/utils/localStorage.utils";
import { toast } from "sonner";

export default function ResetBtn() {
  const resetBtn = () => {
    clearLocalStorage();
    toast.success("Account reset successful");
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

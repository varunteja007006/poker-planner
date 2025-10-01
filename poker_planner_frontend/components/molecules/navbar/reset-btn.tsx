"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Power } from "lucide-react";

import { toast } from "sonner";

import { performReset } from "@/utils/localStorage.utils";
import { useAppContext } from "@/providers/app-provider";

export default function ResetBtn() {
  const { handleSetUser } = useAppContext();

  const resetBtn = () => {
    handleSetUser(null);
    toast.success("Account reset successful");
    performReset();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={resetBtn}
          variant="outline"
          size="icon"
          className="cursor-pointer"
        >
          <Power />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Reset the account</p>
      </TooltipContent>
    </Tooltip>
  );
}

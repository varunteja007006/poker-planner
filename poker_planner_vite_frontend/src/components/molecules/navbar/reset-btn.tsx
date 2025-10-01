import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Power } from "lucide-react";

import { toast } from "sonner";

import { performReset } from "@/lib/local-storage.utils";

export default function ResetBtn() {
  const resetBtn = () => {
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

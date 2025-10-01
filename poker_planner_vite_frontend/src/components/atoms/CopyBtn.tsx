import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { Copy } from "lucide-react";

type CopyBtnProps = {
  text: string;
  children?: React.ReactNode;
  tooltipText?: string;
} & React.ComponentProps<"button">;

export default function CopyBtn({
  text,
  tooltipText,
  children,
  ...props
}: Readonly<CopyBtnProps>) {
  const handleCopyRoomCode = () => {
    try {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy");
      console.error("Failed to copy: ", error);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleCopyRoomCode}
          className="cursor-pointer"
          {...props}
        >
          {children ?? <Copy />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText ?? "Click to copy"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

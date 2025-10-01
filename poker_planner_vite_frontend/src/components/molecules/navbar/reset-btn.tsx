import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

import { performReset } from "@/lib/local-storage.utils";
import { toast } from "sonner";

export default function ResetBtn() {
  const resetBtn = () => {
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

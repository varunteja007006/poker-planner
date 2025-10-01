import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Registration() {
  const [username, setUsername] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      toast.error("Please enter a valid name");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 min-w-sm md:min-w-md">
      <Label htmlFor="username" className="text-primary">
        {`> What do you want to be called?`}
      </Label>
      <div className="flex gap-2">
        <Input
          name="username"
          placeholder="Eg: John Doe"
          value={username}
          onChange={(e) => setUsername(e.target.value ?? "")}
        />
        <Button
          type="submit"
          size={"icon"}
          variant="default"
          className="cursor-pointer"
        >
          <SendHorizontal />
        </Button>
      </div>
    </form>
  );
}

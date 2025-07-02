"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserRegistration() {
  const router = useRouter();

  const [username, setUsername] = React.useState("");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && value.length > 100) {
      return;
    }

    setUsername(event.target.value);
  };

  const handleSubmit = () => {
    console.log(username);
    router.push("/room");
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="username" className="text-primary">
        {`> What do you want to be called?`}
      </Label>
      <div className="flex gap-2">
        <Input
          name="username"
          placeholder="Eg: John Doe"
          value={username}
          onChange={handleUsernameChange}
        />
        <Button
          size={"icon"}
          variant="default"
          onClick={handleSubmit}
          className="cursor-pointer"
        >
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}

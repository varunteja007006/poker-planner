"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SendHorizontal } from "lucide-react";

import { useRouter } from "next/navigation";
import { useCreateUser } from "@/api/user/query";
import { useAppContext } from "@/providers/app-provider";
import { User } from "@/types/user.types";

export default function UserRegistration() {
  const router = useRouter();

  const { handleSetUser } = useAppContext();

  const [username, setUsername] = React.useState("");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && value.length > 100) {
      return;
    }

    setUsername(event.target.value);
  };

  const createUser = useCreateUser();

  const handleSubmit = () => {
    createUser.mutate(username, {
      onSuccess: (response: User) => {
        handleSetUser(response);
        toast.success("User created successfully");
        router.push("/room");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Something went wrong with creating the user");
      },
    });
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

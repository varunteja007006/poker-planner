"use client";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAppContext } from "@/providers/app-provider";

const avatars = [
  {
    name: "unicorn",
    path: "/Unicorn Emoji.webp",
  },
  {
    name: "panda",
    path: "/Panda Face Emoji.webp",
  },
  { name: "rabbit", path: "/Rabbit Face Emoji.webp" },
  { name: "rocket", path: "/Rocket Emoji.webp" },

  { name: "smiley", path: "/Slightly Smiling Face Emoji.webp" },
];

export default function NavUserCard() {
  const { user } = useAppContext();

  if (!user) {
    return null;
  }

  const avatar = avatars[Math.floor(Math.random() * avatars.length)];

  return (
    <div className="mr-5 flex items-center gap-2 flex-row">
      <Avatar className="text-primary">
        <AvatarImage src={avatar.path} />
        <AvatarFallback>
          {user.username.split("").slice(0, 2).join("").toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p className="text-primary font-semibold capitalize">{user.username}</p>
    </div>
  );
}

"use client";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAppContext } from "@/providers/app-provider";

const avatars = [
  { name: "ape", path: "/ape.png" },
  { name: "bunny", path: "/bunny.png" },
  { name: "confused monkey", path: "/confused monkey.png" },
  { name: "dodge challenger", path: "/dodge challenger.png" },
  { name: "dolphin", path: "/dolphin.png" },
  { name: "gollum", path: "/gollum.png" },
  { name: "kingfisher", path: "/kingfisher.png" },
  { name: "lab", path: "/lab.png" },
  { name: "meercat", path: "/meercat.png" },
  { name: "moodeng", path: "/moodeng.png" },
  { name: "pup", path: "/pup.png" },
  { name: "spacemarine", path: "/spacemarine.png" },
  { name: "teddy", path: "/teddy.png" },
  { name: "wiz", path: "/wiz.png" },
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

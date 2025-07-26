import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Users } from "lucide-react";

export default function RoomHistoryItem({
  label,
  roomCode,
  isNew,
}: {
  label: string;
  roomCode: string;
  isNew: boolean;
}) {
  return (
    <div className="text-primary bg-accent flex max-w-xl flex-row items-center justify-between gap-2 rounded p-2">
      <div className="flex flex-row items-center justify-between gap-2">
        <Users className="size-5" />
        {label}
        {isNew && (
          <Badge variant="secondary" className="text-secondary-foreground">
            New
          </Badge>
        )}
      </div>
      <Link href={`/room/${roomCode}`}>
        <Button variant={"default"} size={"sm"} className="cursor-pointer">
          Join
        </Button>
      </Link>
    </div>
  );
}

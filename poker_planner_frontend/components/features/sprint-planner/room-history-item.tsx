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
    <div className="flex text-primary flex-row gap-2 justify-between bg-accent max-w-xl p-2 items-center rounded">
      <div className="flex flex-row gap-2 justify-between items-center">
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

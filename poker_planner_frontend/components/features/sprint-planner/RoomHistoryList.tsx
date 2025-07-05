"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Users } from "lucide-react";

import { ThreeDotLoader } from "@/components/atoms/loaders";
import { useAppContext } from "@/providers/app-provider";
import { useGetAllTeams } from "@/api/team/query";
import { useRouter } from "next/navigation";
import { Team } from "@/types/team.types";

export default function RoomHistoryList() {
  const { room } = useAppContext();

  // need to implement all rooms that the user has joined

  const { data, isLoading, isError, isFetching } = useGetAllTeams({
    filterByUser: true,
  });

  return (
    <>
      <h6 className="mb-2 text-primary">Recent Rooms</h6>
      <RoomHistoryItem
        label={room?.room_code as string}
        roomCode={room?.room_code as string}
        isNew={true}
      />

      <h6 className="mb-2 mt-5 text-primary">Previous Rooms</h6>
      {isError ? (
        "Error fetching teams"
      ) : isLoading || isFetching ? (
        <ThreeDotLoader />
      ) : (
        <div className="flex flex-col gap-2">
          {data?.slice(1)?.map((item: Team) => {
            return (
              <RoomHistoryItem
                key={item.id}
                label={item.room.room_code as string}
                roomCode={item.room.room_code as string}
                isNew={false}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

const RoomHistoryItem = ({
  label,
  roomCode,
  isNew,
}: {
  label: string;
  roomCode: string;
  isNew: boolean;
}) => {
  const router = useRouter();

  function handleJoinRoom() {
    router.push(`/room/${roomCode}`);
  }

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
      <Button
        variant={"default"}
        size={"sm"}
        className="cursor-pointer"
        onClick={handleJoinRoom}
      >
        Join
      </Button>
    </div>
  );
};

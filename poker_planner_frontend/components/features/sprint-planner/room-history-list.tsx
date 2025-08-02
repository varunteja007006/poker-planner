"use client";

import React from "react";

import { ThreeDotLoader } from "@/components/atoms/loaders";
import { useGetAllTeams } from "@/api/team/query";
import { Team } from "@/types/team.types";
import RoomHistoryItem from "./room-history-item";
import { getRoomFromLocalStorage } from "@/utils/localStorage.utils";

export default function RoomHistoryList() {
  const room = getRoomFromLocalStorage();

  // gets all the team records resulting in rooms he joined
  const { data, isLoading, isError, isFetching } = useGetAllTeams({
    filterByUser: true,
  });

  return (
    <>
      <h6 className="text-primary mb-2">Recent Rooms</h6>
      {room?.id ? (
        <RoomHistoryItem
          label={room?.room_code as string}
          roomCode={room?.room_code as string}
          isNew={false}
        />
      ) : (
        <p className="text-sm">No recent rooms 😔</p>
      )}

      <h6 className="text-primary mt-5 mb-2">Previous Rooms</h6>
      {isError ? (
        <p className="text-sm">Error fetching teams ❌</p>
      ) : isLoading || isFetching ? (
        <ThreeDotLoader />
      ) : (
        <div className="flex flex-col gap-2">
          {data?.length ? (
            data?.map((item: Team) => {
              return (
                <RoomHistoryItem
                  key={item.id}
                  label={item.room.room_code as string}
                  roomCode={item.room.room_code as string}
                  isNew={false}
                />
              );
            })
          ) : (
            <p className="text-sm">No previous rooms 😔</p>
          )}
        </div>
      )}
    </>
  );
}

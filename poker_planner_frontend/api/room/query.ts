import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Room } from "@/types/room.types";
import RoomApi from "./api";

export const useCreateRoom = () => {
  return useMutation({
    mutationFn: RoomApi.createRoom,
  });
};

export const useGetAllRooms = (
  params: { room_code: string },
  options?: Omit<
    UseQueryOptions<Room[], Error, Room[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => RoomApi.getAllRooms(params),
    ...options,
  });
};

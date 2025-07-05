import { useMutation } from "@tanstack/react-query";

import RoomApi from "./api";

export const useCreateRoom = () => {
  return useMutation({
    mutationFn: RoomApi.createRoom,
  });
};

import { useMutation, useQuery } from "@tanstack/react-query";

import UserApi from "./api";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: UserApi.createUser,
  });
};

export const useGetUserById = (id: number | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UserApi.getUserById(id!),
    enabled: enabled && id !== null,
    retry: false, // Don't retry if user not found
  });
};

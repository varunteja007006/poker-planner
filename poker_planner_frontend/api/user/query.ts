import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import UserApi from "./api";

import { User } from "@/types/user.types";

export const useCreateUser = (
  args: UseMutationOptions<User, unknown, string, unknown>
) => {
  return useMutation({
    mutationFn: (username: string) => UserApi.createUser(username),
    ...args,
  });
};

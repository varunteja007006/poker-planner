import { useMutation } from "@tanstack/react-query";

import UserApi from "./api";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: UserApi.createUser,
  });
};

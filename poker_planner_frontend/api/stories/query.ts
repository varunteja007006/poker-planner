import { useMutation, useQueryClient } from "@tanstack/react-query";

import StoriesApi from "./api";
import { setStoryInLocalStorage } from "@/utils/localStorage.utils";

export const useCreateStory = () => {
  const queryClient = useQueryClient();
  const createStory = useMutation({
    mutationFn: StoriesApi.createStory,
    onSuccess: (response) => {
      setStoryInLocalStorage(response);
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  return createStory;
};

export const useUpdateStory = () => {
  const queryClient = useQueryClient();
  const updateStory = useMutation({
    mutationFn: StoriesApi.updateStory,
    onSuccess: (response) => {
      setStoryInLocalStorage(response);
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  return updateStory;
};

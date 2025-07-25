"use client";

import { create } from "zustand";

import { Story } from "@/types/story.types";

type TStoriesStore = {
  story: Story | null;
  updateStory: (story: Story) => void;
};

const useStoriesStore = create<TStoriesStore>((set) => ({
  story: null,
  updateStory: (story: Story) => set({ story }),
}));

export const StoriesStore = {
  useUpdateStory: () => {
    return useStoriesStore((state) => state.updateStory);
  },
  useStory: () => {
    return useStoriesStore((state) => state.story);
  },
};

'use client'

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

export class StoriesStore {
  static useStory() {
    return useStoriesStore((state) => state.story);
  }

  static useUpdateStory() {
    return useStoriesStore((state) => state.updateStory);
  }
}

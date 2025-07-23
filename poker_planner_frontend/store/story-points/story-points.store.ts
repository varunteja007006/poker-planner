"use client";

import { StoryPoint } from "@/types/story-points.types";
import { Story } from "@/types/story.types";
import { create } from "zustand";

type StoryPointMetadata = {
  clientId: string;
  message: string;
  body: Story;
  storyPoints: StoryPoint[];
  groupByStoryPoint: Record<string, number>;
  averageStoryPoint: number;
};

type TStoryPointsStore = {
  storyPoint: StoryPoint | null;
  storyPointsMetadata: StoryPointMetadata | null;
  actions: {
    updateStoryPoints: (story: StoryPoint) => void;
    updateStoryPointsMeta: (story: StoryPointMetadata | null) => void;
  };
};

// store for story points
const useStoryPointsStore = create<TStoryPointsStore>((set) => ({
  storyPoint: null,
  storyPointsMetadata: null,
  actions: {
    updateStoryPoints: (story) => set({ storyPoint: story }),
    updateStoryPointsMeta: (payload) => set({ storyPointsMetadata: payload }),
  },
}));

// subscribe to the store and export them
export class StoriesPointsStore {
  static useStoryPoints() {
    return useStoryPointsStore((state) => state.storyPoint);
  }

  static useStoryPointsMetadata() {
    return useStoryPointsStore((state) => state.storyPointsMetadata);
  }

  static useUpdateStoryPointsActions() {
    return useStoryPointsStore((state) => state.actions);
  }
}

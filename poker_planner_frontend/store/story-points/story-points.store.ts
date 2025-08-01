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
  storyPointsData: StoryPoint[]; // list of all story points of the room
  actions: {
    updateStoryPoints: (story: StoryPoint) => void;
    updateStoryPointsMeta: (story: StoryPointMetadata | null) => void;
    updateStoryPointsData: (story: StoryPoint[]) => void;
  };
};

// store for story points
const useStoryPointsStore = create<TStoryPointsStore>((set) => ({
  storyPoint: null,
  storyPointsMetadata: null,
  storyPointsData: [],
  actions: {
    updateStoryPoints: (story) => set({ storyPoint: story }),
    updateStoryPointsMeta: (payload) => set({ storyPointsMetadata: payload }),
    updateStoryPointsData: (story) => set({ storyPointsData: story }),
  },
}));

// subscribe to the store and export them
export const StoriesPointsStore = {
  useStoryPoints: () => {
    return useStoryPointsStore((state) => state.storyPoint);
  },

  useStoryPointsMetadata: () => {
    return useStoryPointsStore((state) => state.storyPointsMetadata);
  },

  useStoryPointsData: () => {
    return useStoryPointsStore((state) => state.storyPointsData);
  },

  // actions
  useUpdateStoryPointsActions: () => {
    return useStoryPointsStore((state) => state.actions);
  },
};

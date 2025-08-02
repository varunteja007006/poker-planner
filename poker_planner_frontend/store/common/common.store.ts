"use client";

import { Room } from "@/types/room.types";
import { StoryPoint } from "@/types/story-points.types";
import { Story } from "@/types/story.types";
import { Team } from "@/types/team.types";
import { User } from "@/types/user.types";
import { create } from "zustand";

export type TMetadata = {
  clientId: string;
  user: User;
  room: Room;
  team: Team;
  teamMembers: Team[];
  inProgressStories: Story[] | null;
  inProgressStory: Story | null;
  storyPoints: StoryPoint[] | null;
};

export type TCommonStore = {
  metadata: TMetadata | null;
  actions: {
    updateMetadata: (metadata: TMetadata) => void;
    updateMetadataPartially: (metadata: Partial<TMetadata>) => void;
  };
};

const useCommonStore = create<TCommonStore>((set) => ({
  metadata: null,
  actions: {
    updateMetadata: (metadata: TMetadata) => set({ metadata }),
    updateMetadataPartially: (metadata: Partial<TMetadata>) =>
      set((state) => ({
        metadata: state.metadata
          ? { ...state.metadata, ...metadata }
          : ({ ...metadata } as TMetadata),
      })),
  },
}));

export const CommonStore = {
  useUpdateMetadataActions: () => {
    return useCommonStore((state) => state.actions);
  },

  useMetadata: () => {
    return useCommonStore((state) => state.metadata);
  },
};

"use client";

import { create } from "zustand";

import { Team } from "@/types/team.types";

type TTeamStore = {
  team: Team[];
  updateTeam: (team: Team[]) => void;
};

const useTeamStore = create<TTeamStore>((set) => ({
  team: [],
  updateTeam: (team: Team[]) => set({ team }),
}));

export const TeamStore = {
  useTeam: () => {
    return useTeamStore((state) => state.team);
  },
  useUpdateTeam: () => {
    return useTeamStore((state) => state.updateTeam);
  },
};

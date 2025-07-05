import { useMutation, useQuery } from "@tanstack/react-query";

import TeamApi from "./api";
import { Team } from "@/types/team.types";

export const useGetAllTeams = (params: {
  room_code?: string;
  filterByUser?: boolean;
}) => {
  return useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: () => TeamApi.getAllTeams(params),
  });
};

export const useGetTeamById = (id: number) => {
  return useQuery<Team>({
    queryKey: ["team", id],
    queryFn: () => TeamApi.getTeamById(id),
  });
};

export const useCreateTeam = () => {
  return useMutation({
    mutationFn: TeamApi.createTeam,
  });
};

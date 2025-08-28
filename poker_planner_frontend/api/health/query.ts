import { useQuery } from "@tanstack/react-query";
import HealthApi from "./api";

const THIRTY_MINUTES = 30 * 60 * 1000;

export const useCheckBackendHealth = () => {
  return useQuery({
    queryKey: ["health", "backend"],
    queryFn: HealthApi.checkBackendHealth,
    staleTime: THIRTY_MINUTES,
  });
};

export const useCheckDatabaseHealth = () => {
  return useQuery({
    queryKey: ["health", "database"],
    queryFn: HealthApi.checkDatabaseHealth,
    staleTime: THIRTY_MINUTES,
  });
};

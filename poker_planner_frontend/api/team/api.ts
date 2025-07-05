import axiosInstance from "../config/axios";

class TeamApi {
  static async getAllTeams({
    room_code,
    filterByUser,
  }: {
    room_code?: string;
    filterByUser?: boolean;
  }) {
    const response = await axiosInstance.get("/teams", {
      params: { room_code, filterByUser },
    });
    return response.data;
  }

  static async createTeam(payload: {
    room_code: string;
    is_room_owner?: boolean;
  }) {
    const response = await axiosInstance.post("/teams", payload);
    return response.data;
  }

  static async getTeamById(id: number) {
    const response = await axiosInstance.get(`/teams/${id}`);
    return response.data;
  }
}

export default TeamApi;

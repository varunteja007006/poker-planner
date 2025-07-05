import axiosInstance from "../config/axios";

class TeamApi {
  static async getAllTeams() {
    const response = await axiosInstance.get("/teams");
    return response.data;
  }

  static async createTeam(payload: {
    room_id: number;
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

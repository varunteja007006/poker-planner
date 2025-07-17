import axiosInstance from "../config/axios";

class RoomApi {
  static async createRoom(payload: { room_code: string }) {
    const response = await axiosInstance.post("/rooms", payload);
    return response.data;
  }
}

export default RoomApi;

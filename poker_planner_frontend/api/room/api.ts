import { Room } from "@/types/room.types";
import axiosInstance from "../config/axios";

class RoomApi {
  static async createRoom(payload: { room_code: string }) {
    const response = await axiosInstance.post("/rooms", payload);
    return response.data;
  }

  static async getAllRooms(params: { room_code: string }): Promise<Room[]> {
    const response = await axiosInstance.get("/rooms", { params });
    return response.data;
  }
}

export default RoomApi;

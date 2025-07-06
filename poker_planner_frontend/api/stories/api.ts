import { Story } from "@/types/story.types";
import axiosInstance from "../config/axios";

class StoriesApi {
  static async createStory(payload: {
    title: string;
    description: string;
    room_code: string;
    story_point_evaluation_status?: "pending" | "in progress" | "completed";
  }): Promise<Story> {
    const response = await axiosInstance.post("/stories", payload);
    return response.data;
  }

  static async updateStory(payload: {
    id: number;
    title?: string;
    description?: string;
    story_point_evaluation_status?: "pending" | "in progress" | "completed";
  }): Promise<Story> {
    const { id, ...rest } = payload;

    const response = await axiosInstance.patch(`/stories/${id}`, rest);
    return response.data;
  }
}

export default StoriesApi;

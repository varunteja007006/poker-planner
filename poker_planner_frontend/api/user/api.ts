import axiosInstance from "../config/axios";

class UserApi {
  static async createUser(username: string) {
    const response = await axiosInstance.post("/users", { username });
    return response.data;
  }

  static async getUserById(id: number) {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  }
}

export default UserApi;

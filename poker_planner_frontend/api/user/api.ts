import axiosInstance from "../config/axios";

class UserApi {
  static async createUser(username: string) {
    const response = await axiosInstance.post("/users", { username });
    return response.data;
  }
}

export default UserApi;

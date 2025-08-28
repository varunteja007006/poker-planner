import axiosInstance from "../config/axios";

class HealthApi {
  static async checkBackendHealth() {
    const response = await axiosInstance.get("/health/backend");
    return response.data;
  }

  static async checkDatabaseHealth(): Promise<{
    status: string;
    message: string;
  }> {
    const response = await axiosInstance.get("/health/db");
    return response.data;
  }
}

export default HealthApi;

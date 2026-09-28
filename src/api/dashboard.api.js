import baseApi from "./baseApi";

export const getDashboardStats = async () => {
  const response = await baseApi.get("/dashboard/stats");
  return response.data;
};

import axios from "axios";
import { getNewAccessToken } from "../components/GetNewAccessToken";
import toast from "react-hot-toast";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  // baseURL: "https://api.qcspot.pro/api/v1",
});

axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

// Add a response interceptor
axiosSecure.interceptors.response.use(
  (response) => {
    // Simply return the response for successful requests
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token (status 401 is more common for auth errors)
    if (
      error.response?.data?.message ===
        "Unauthorized User: Token decoding failed" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await getNewAccessToken();
        const accessToken = response?.data?.approvalToken;

        if (accessToken) {
          localStorage.setItem("token", accessToken);
          originalRequest.headers["Authorization"] = accessToken;
          return axiosSecure(originalRequest);
        } else {
          // If no access token, logout
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
          toast.error("Plaease login to continue");
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        toast.error("Plaease login to continue");
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default axiosSecure;

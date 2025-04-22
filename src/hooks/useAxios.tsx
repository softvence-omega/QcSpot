import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://api.qcspot.pro/api/v1",
});

axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

export default axiosSecure;

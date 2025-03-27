import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://qcspot-backend.onrender.com/api/v1",
});

// const useAxiosSecure = () => {
//   return [axiosSecure]
// }

export default axiosSecure;

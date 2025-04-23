import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./useAxios";

const useUsers = () => {
  const {
    data: usersData = [],
    isLoading: usersLoading,
    refetch: usersRefetch,
  } = useQuery({
    queryKey: ["usersData"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/getAllUser`);
      return res.data?.data?.users;
    },
  });

  return { usersData, usersLoading, usersRefetch };
};

export default useUsers;

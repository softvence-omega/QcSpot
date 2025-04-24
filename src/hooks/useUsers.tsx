import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./useAxios";

const useUsers = (
  queryParams?: Record<string, string | number | undefined>
) => {
  const queryString = queryParams
    ? `?${new URLSearchParams(
        Object.fromEntries(
          Object.entries(queryParams).filter(
            ([_, value]) => value !== undefined && value !== ""
          )
        ) as Record<string, string>
      ).toString()}`
    : "";
  const {
    data: usersData = [],
    isLoading: usersLoading,
    refetch: usersRefetch,
  } = useQuery({
    queryKey: ["usersData", queryParams],
    queryFn: async () => {
      console.log(queryString);
      const res = await axiosSecure.get(`/users/getAllUser${queryString}`);
      return res.data?.data;
    },
  });

  return { usersData, usersLoading, usersRefetch };
};

export default useUsers;

import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./useAxios";

const useAgent = (
  queryParams?: Record<string, string | boolean | undefined>
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
    data: agentData = [],
    isLoading: agentLoading,
    refetch: agentRefetch,
  } = useQuery({
    queryKey: ["agentData", queryParams],
    queryFn: async () => {
      const res = await axiosSecure.get(`/agent/getAgent${queryString}`);
      return res.data?.data;
    },
  });

  return { agentData, agentLoading, agentRefetch };
};

export default useAgent;

import { useQuery } from "@tanstack/react-query";
// import axiosSecure from "./useAxios";

const useAgent = () => {
  const {
    data: agentData = [],
    isLoading: agentLoading,
    refetch: agentRefetch,
  } = useQuery({
    queryKey: ["agentData"],
    queryFn: async () => {
      //   const res = await axiosSecure.get(`/users/viewagent`);
      //   return res.data?.data?.productagent;

      const response = await fetch("/agent.json");
      return await response.json();
    },
  });

  return { agentData, agentLoading, agentRefetch };
};

export default useAgent;

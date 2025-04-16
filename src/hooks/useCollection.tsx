import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./useAxios";

const useCollection = () => {
  const {
    data: collectionData = [],
    isLoading: collectionLoading,
    refetch: collectionRefetch,
  } = useQuery({
    queryKey: ["collectionData"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/viewCollection`);
      return res.data?.data?.productCollection || [];
    },
  });

  return { collectionData, collectionLoading, collectionRefetch };
};

export default useCollection;

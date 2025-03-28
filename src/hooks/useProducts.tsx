import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./useAxios";

const useProduct = (queryParams?: Record<string, string | number>) => {
  const queryString = queryParams
    ? `?${new URLSearchParams(
        queryParams as Record<string, string>
      ).toString()}`
    : "";

  const {
    data: productData = [],
    isLoading: productLoading,
    refetch: productRefetch,
  } = useQuery({
    queryKey: ["productData", queryParams], // Ensures query updates when params change
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/products/getAllProduct${queryString}`
      );
      return res.data?.data;
    },
  });

  return { productData, productLoading, productRefetch };
};

export default useProduct;

import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./useAxios";

const useProduct = (
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
    data: productData = [],
    isLoading: productLoading,
    refetch: productRefetch,
  } = useQuery({
    queryKey: ["productData", queryParams], // Query updates when params change
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

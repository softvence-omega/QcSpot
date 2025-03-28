import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./useAxios";

const useProduct = () => {
  const {
    data: productData = [],
    isLoading: productLoading,
    refetch: productRefetch,
  } = useQuery({
    queryKey: ["productData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products/getAllProduct");
      return res.data?.data;
    },
  });
  return { productData, productLoading, productRefetch };
};

export default useProduct;

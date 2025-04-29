import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./useAxios";

const useSingleProduct = (id: string) => {
  const {
    data: singleProductData = [],
    isLoading: singleProductLoading,
    refetch: singleProductRefetch,
  } = useQuery({
    queryKey: ["singleProductData", id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/products/findProductById?productCode=${id}&count=true`
      );
      return res.data?.data;
    },
    enabled: !!id,
  });

  return { singleProductData, singleProductLoading, singleProductRefetch };
};

export default useSingleProduct;

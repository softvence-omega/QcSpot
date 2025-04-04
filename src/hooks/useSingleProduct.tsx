import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./useAxios";

const useSingleProduct = (id: string) => {
  const {
    data: singleProductData = [],
    isLoading: singleProductLoading,
    refetch: singleProductRefetch,
  } = useQuery({
    queryKey: ["singleProductData"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/products/findProductById?product_Id=${id}&count=true`
      );
      return res.data?.data;
    },
  });

  return { singleProductData, singleProductLoading, singleProductRefetch };
};

export default useSingleProduct;

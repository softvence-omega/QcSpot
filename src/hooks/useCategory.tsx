import { useQuery } from "@tanstack/react-query";
// import axiosSecure from "./useAxios";

const useCategory = () => {
  const {
    data: categoryData = [],
    isLoading: categoryLoading,
    refetch: categoryRefetch,
  } = useQuery({
    queryKey: ["categoryData"],
    queryFn: async () => {
      const response = await fetch("/category.json");
      return await response.json();
    },
  });

  return { categoryData, categoryLoading, categoryRefetch };
};

export default useCategory;

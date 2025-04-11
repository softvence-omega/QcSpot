import { useQuery } from "@tanstack/react-query";
// import axiosSecure from "./useAxios";

const useCountry = () => {
  const {
    data: countryData = [],
    isLoading: countryLoading,
    refetch: countryRefetch,
  } = useQuery({
    queryKey: ["countryData"],
    queryFn: async () => {
      const response = await fetch("/country.json");
      return await response.json();
    },
  });

  return { countryData, countryLoading, countryRefetch };
};

export default useCountry;

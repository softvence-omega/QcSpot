import toast from "react-hot-toast";

export const handleQcSearch = async (
  input: string,
  navigate: (path: string) => void
) => {
  try {
    const response = await fetch(
      `https://cnfans.com/search-api/detail/search-info?input=${input}&site=cnfans&lang=en&wmc-currency=USD`
    );
    const data = await response.json();
    const productID = data?.data?.result?.productID;

    if (productID) {
      navigate(`/product/${productID}`);
    } else {
      toast.error("Product not found");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("Something went wrong");
  }
};

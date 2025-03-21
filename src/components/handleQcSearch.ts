export const handleQcSearch = async (
  input: string,
  navigate: (path: string) => void
) => {
  const url = new URL(input);
  const shopType =
    url.searchParams.get("platform") || url.searchParams.get("shoptype") || "";
  const id = url.searchParams.get("id") || "";
  navigate(`/product/${shopType}/${id}`);

  // try {
  //   let response;
  //   let shopType = "";
  //   let id = "";
  //   console.log(input);

  //   if (input.includes("cnfans.com")) {
  //     const url = new URL(input);
  //     shopType =
  //       url.searchParams.get("platform") ||
  //       url.searchParams.get("shoptype") ||
  //       "";
  //     id = url.searchParams.get("id") || "";

  //     if (shopType && id) {
  //       response = await fetch(
  //         `https://cnfans.com/search-api/detail/product-info?platform=${shopType}&productID=${id}&forceReload=false&site=cnfans&lang=en&wmc-currency=USD`
  //       );
  //     } else {
  //       toast.error("Missing platform or product ID in the URL.");
  //       return;
  //     }
  //   } else {
  //     response = await fetch(
  //       `https://cnfans.com/search-api/detail/search-info?input=${input}&site=cnfans&lang=en&wmc-currency=USD`
  //     );
  //   }

  //   const data = await response.json();
  //   const productID = data?.data?.result?.productID || id;

  //   console.log(data, productID);

  //   if (productID) {
  //     navigate(`/product/${productID}`);
  //   } else {
  //     toast.error("Product not found");
  //   }
  // } catch (error) {
  //   console.error("Error fetching data:", error);
  //   toast.error("Something went wrong");
  // }
};

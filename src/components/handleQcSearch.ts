function extractFromUrl(url: string) {
  const urlInput = new URL(url);
  const partBeforeDotCom = url.split(".com")[0];

  const lastSlashIndex = partBeforeDotCom.lastIndexOf("/");
  const lastDotIndex = partBeforeDotCom.lastIndexOf(".");
  const delimiterIndex = Math.max(lastSlashIndex, lastDotIndex);

  const domain = partBeforeDotCom.slice(
    delimiterIndex + 1,
    partBeforeDotCom.length
  );
  const itemID = urlInput.searchParams.get("itemID");
  return { domain, itemID };
}

export const handleQcSearch = async (
  input: string,
  navigate: (path: string) => void
) => {
  const url = new URL(input);
  const searchedUrl = url.searchParams.get("url");
  if (searchedUrl) console.log(searchedUrl);
  if (searchedUrl) console.log(extractFromUrl(searchedUrl));

  const shopType =
    url.searchParams.get("shoptype") ||
    url.searchParams.get("shop_type") ||
    url.searchParams.get("channel") ||
    url.searchParams.get("source") ||
    url.searchParams.get("platform") ||
    (searchedUrl && extractFromUrl(searchedUrl).domain);
  ("");
  const id =
    url.searchParams.get("id") ||
    url.searchParams.get("itemID") ||
    (searchedUrl && extractFromUrl(searchedUrl).itemID) ||
    "";
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

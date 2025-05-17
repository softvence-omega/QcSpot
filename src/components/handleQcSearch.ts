import Swal from "sweetalert2";

// Extract domain from url
export function extractFromUrl(url: string) {
  console.log("Hello");
  let domain: string, itemID: string;
  const urlInput = new URL(url);
  const partBeforeDotCom = url.split(".com")[0];

  const lastSlashIndex = partBeforeDotCom.lastIndexOf("/");
  const lastDotIndex = partBeforeDotCom.lastIndexOf(".");
  const delimiterIndex = Math.max(lastSlashIndex, lastDotIndex);

  domain = partBeforeDotCom.slice(delimiterIndex + 1, partBeforeDotCom.length);
  itemID =
    urlInput.searchParams.get("itemID") ||
    urlInput.searchParams.get("id") ||
    "";

  const ali_1688Url = urlInput.href.includes("detail.1688.com/offer");
  if (ali_1688Url) {
    itemID = urlInput.href.split("offer/")[1].split(".html")[0];
    domain = "ali_1688";
  }

  const taobaoUrl = urlInput.href.includes("item.taobao.com");
  if (taobaoUrl) {
    console.log("inside taobao");
    itemID = urlInput.searchParams.get("id") || "";
    domain = "taobao";
    console.log(domain, itemID);
  }

  return { domain, itemID };
}

// Function to handle the cssbuy URL
export function handleCssBuyUrl(url: string) {
  let shopType = "";
  let itemId = "";

  // Check if URL contains 'item-micro' to set shopType to 'WEIDIAN'
  if (url.includes("item-micro")) {
    shopType = "WEIDIAN";
    itemId = url.split("item-micro-")[1].split(".htm")[0];
  }
  // Check if URL contains 'item-1688' to set shopType to 'ali_1688'
  else if (url.includes("item-1688")) {
    shopType = "ali_1688";
    itemId = url.split("item-1688-")[1].split(".htm")[0];
  }
  // Default to 'TAOBAO' if it contains 'item-' (assuming it's a Taobao item)
  else if (url.includes("item-")) {
    shopType = "TAOBAO";
    itemId = url.split("item-")[1].split(".htm")[0];
  }
  return { shopType, itemId };
}

export function handleAcBuyUrl(source: string) {
  if (source === "AL") return "ali_1688";
  else if (source === "TB") return "TAOBAO";
  else if (source === "WD") return "WEIDIAN";
}

// Handle Qc Search
export const handleQcSearch = async (
  input: string,
  navigate: (path: string) => void
) => {
  try {
    const url = new URL(input);
    const searchedUrl = url.searchParams.get("url");
    const cssBuyUrl = url.href.includes("www.cssbuy.com");
    const acBuyUrl = url.href.includes("www.acbuy.com");
    const taobaoUrl =
      url.href.includes("item.taobao.com") ||
      url.href.includes("detail.tmall.com");

    const weidianUrl = url.href.includes("weidian.com");
    const ali_1688Url = url.href.includes("detail.1688.com");

    let shopType: string | undefined;
    let id: string | undefined;
    console.log(searchedUrl);

    shopType =
      url.searchParams.get("shoptype") ||
      url.searchParams.get("shop_type") ||
      url.searchParams.get("channel") ||
      url.searchParams.get("platform") ||
      (searchedUrl && extractFromUrl(searchedUrl).domain) ||
      ((cssBuyUrl && handleCssBuyUrl(url.href)?.shopType) as string) ||
      ((acBuyUrl &&
        handleAcBuyUrl(url.searchParams.get("source") as string)) as string);

    id =
      url.searchParams.get("id") ||
      url.searchParams.get("itemID") ||
      url.searchParams.get("goodsId") ||
      (searchedUrl && extractFromUrl(searchedUrl).itemID) ||
      ((cssBuyUrl && handleCssBuyUrl(url.href)?.itemId) as string);

    if (ali_1688Url) {
      id = url.href.split("offer/")[1].split(".html")[0];
      shopType = "ali_1688";
    }
    if (taobaoUrl) {
      id = url.searchParams.get("id") || "";
      shopType = "taobao";
    }
    if (weidianUrl) {
      id = url.searchParams.get("itemID") || "";
      shopType = "weidian";
    }

    if (!shopType || !id) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid URL or missing parameters!",
        footer:
          "The URL you provided is not supported. If you think this is a mistake, please contact us.",
      });
      return;
    }
    localStorage.setItem("url", input);
    if (!shopType) shopType = "taobao";
    navigate(`/product/${shopType}/${id}`);
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Invalid URL format!",
      footer: "Please provide a valid URL.",
    });
  }
};

// https://detail.tmall.com/item.htm?id=839492675628&spm=a21bo.jianhua%2Fa.201876.d3.5af92a895eX7XB&scm=1007.40986.436100.0&pvid=a0b4401c-68e3-461e-bf76-be82f1878fe9&xxc=home_recommend&skuId=5965671030031&utparam=%7B%22abid%22%3A%220%22%2C%22x_object_type%22%3A%22item%22%2C%22pc_pvid%22%3A%22a0b4401c-68e3-461e-bf76-be82f1878fe9%22%2C%22mix_group%22%3A%22%22%2C%22pc_scene%22%3A%2220001%22%2C%22aplus_abtest%22%3A%22905c2ac9ebc16d6946661c42b99b1d3f%22%2C%22tpp_buckets%22%3A%2230986%23436100%23module%22%2C%22x_object_id%22%3A839492675628%2C%22ab_info%22%3A%2230986%23436100%23-1%23%22%7D&ltk2=174747188874598y45sscgogzlejx0oyu

/* eslint-disable @typescript-eslint/no-unused-vars */
import Swal from "sweetalert2";

// Extract domain from url
export function extractFromUrl(url: string) {
  let domain: string, itemID: string;
  const urlInput = new URL(url);
  const partBeforeDotCom = url.split(".com")[0];
  console.log(partBeforeDotCom);

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
  console.log(urlInput.href);
  console.log(taobaoUrl);
  if (taobaoUrl) {
    itemID = urlInput.searchParams.get("id") || "";
    domain = "taobao";
  }
  console.log(itemID, domain);

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

    if (!searchedUrl && ali_1688Url) {
      id = url.href.split("offer/")[1].split(".html")[0];
      shopType = "ali_1688";
    }
    if (!searchedUrl && taobaoUrl) {
      id = url.searchParams.get("id") || "";
      shopType = "taobao";
    }
    if (!searchedUrl && weidianUrl) {
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

// https://item.taobao.com/item.htm?spm=a21bo.jianhua%2Fa.201876.d4.5af92a89aRByzE&id=921978897894&scm=1007.40986.436100.0&pvid=c08108d2-a887-494f-b7d3-f58b07a72161&xxc=home_recommend&skuId=5962873546758&utparam=%7B%22abid%22%3A%220%22%2C%22x_object_type%22%3A%22item%22%2C%22pc_pvid%22%3A%22c08108d2-a887-494f-b7d3-f58b07a72161%22%2C%22mix_group%22%3A%22%22%2C%22pc_scene%22%3A%2220001%22%2C%22aplus_abtest%22%3A%22210c49516e93dec24a9a8dd6012ae2b9%22%2C%22tpp_buckets%22%3A%2230986%23436100%23module%22%2C%22x_object_id%22%3A921978897894%2C%22ab_info%22%3A%2230986%23436100%23-1%23%22%7D&ltk2=1747627234752eqq00dq6j8muizonkzb7

// https://detail.tmall.com/item.htm?id=890519039246&spm=a21bo.tmall%2Fa.201876.d2.6614c3d5cnnBsf&scm=1007.40986.436100.0&pvid=306f19ce-ec88-4610-b318-c80af932d619&xxc=home_recommend&skuId=5903588594908&utparam=%7B%22abid%22%3A%220%22%2C%22x_object_type%22%3A%22item%22%2C%22pc_pvid%22%3A%22306f19ce-ec88-4610-b318-c80af932d619%22%2C%22mix_group%22%3A%22%22%2C%22pc_scene%22%3A%2220001%22%2C%22aplus_abtest%22%3A%225f15c1866dd9e2916e7d79538702f7b4%22%2C%22tpp_buckets%22%3A%2230986%23436100%23module%22%2C%22x_object_id%22%3A890519039246%2C%22ab_info%22%3A%2230986%23436100%23-1%23%22%7D&priceTId=215045b117476272584908885e1c81&ltk2=1747628808718r43g9le19khjopy4xgsns8

// https://detail.1688.com/offer/855621431736.html?offerId=855621431736&spm=a260k.home2025.recommendpart.3

// https://weidian.com/item.html?itemID=2167488966&spider_token=9736

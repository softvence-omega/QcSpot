import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PlatformLink = ({ id, shopType }: { id?: string; shopType?: string }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");

  const updatePlatformData = () => {
    setSelectedPlatform(localStorage.getItem("platform") || "CNFans");
    setSelectedImage(localStorage.getItem("platform_img") || "");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updatePlatformData();
    }, 100);
    return () => clearInterval(interval);
  }, []);

  let to = "/";
  const formattedShopType = shopType?.toLowerCase();

  // Oopbuy
  if (selectedPlatform === "Oopbuy")
    to = `https://oopbuy.com/goods/details?id=${id}&channel=${formattedShopType}&inviteCode=GW72B7VYF`;
  // ACBuy
  else if (selectedPlatform === "ACBuy") {
    if (formattedShopType === "taobao") {
      to = `https://www.acbuy.com/product?id=${id}&source=TB&u=XRTG9T`;
    } else if (formattedShopType === "weidian") {
      to = `https://www.acbuy.com/product?id=${id}&source=WD&u=XRTG9T`;
    } else if (formattedShopType === "ali_1688" || "1688") {
      to = `https://www.acbuy.com/product?id=${id}&source=AL&u=XRTG9T`;
    }
  }
  // Ootdbuy
  else if (selectedPlatform === "Ootdbuy")
    to = `https://www.ootdbuy.com/goods/details?id=${id}&channel=${formattedShopType}&inviteCode=FINDSLY`;
  // Lovegobuy
  else if (selectedPlatform === "Lovegobuy")
    to = `https://m.lovegobuy.com/product?id=${id}&shop_type=${formattedShopType}&invite_code=Q7W6G7`;
  // Hippoobuy
  else if (selectedPlatform === "Hippoobuy") {
    if (formattedShopType === "taobao") {
      to = `https://hippoobuy.com/en_US/goods/detail?keyword=https://item.taobao.com/item.htm?id=${id}&invitor_id=1305828`;
    } else if (formattedShopType === "weidian") {
      to = `https://hippoobuy.com/en_US/goods/detail?keyword=https://weidian.com/item.html?itemID=${id}&invitor_id=1305828`;
    } else if (formattedShopType === "ali_1688" || "1688") {
      to = `https://hippoobuy.com/en_US/goods/detail?keyword=https://detail.1688.com/offer/${id}.html&invitor_id=1305828`;
    }
  }
  // CSSBuy
  else if (selectedPlatform === "CSSBuy") {
    if (formattedShopType === "taobao") {
      to = `https://www.cssbuy.com/item-${id}.html?promotionCode=d34d2363db4cdb95`;
    } else if (formattedShopType === "weidian") {
      to = `https://www.cssbuy.com/item-micro-${id}.html?promotionCode=d34d2363db4cdb95`;
    } else if (formattedShopType === "ali_1688" || "1688") {
      to = `https://www.cssbuy.com/item-1688-${id}.html?promotionCode=d34d2363db4cdb95`;
    }
  }
  // CNFans
  else if (selectedPlatform === "CNFans")
    to = `https://cnfans.com/product/?shop_type=${formattedShopType}&id=${id}&ref=72365`;
  // Loongbuy
  else if (selectedPlatform === "Loongbuy") {
    if (formattedShopType === "taobao") {
      to = `https://loongbuy.com/product-details?invitecode=F00T846H&url=https://taobao.com/item.html?itemID=${id}`;
    } else if (formattedShopType === "weidian") {
      to = `https://loongbuy.com/product-details?invitecode=F00T846H&url=https://weidian.com/item.html?itemID=${id}`;
    } else if (formattedShopType === "ali_1688" || "1688") {
      to = `https://loongbuy.com/product-details?invitecode=F00T846H&url=https://detail.1688.com/offer/${id}.html`;
    }
  }
  // Mulebuy
  else if (selectedPlatform === "Mulebuy")
    to = `https://mulebuy.com/product/?shop_type=${formattedShopType}&id=${id}&ref=200162669`;
  // Joyabuy
  else if (selectedPlatform === "Joyabuy")
    to = `https://joyabuy.com/product/?shop_type=${formattedShopType}&id=${id}&ref=300083887`;
  // Eastmallbuy
  else if (selectedPlatform === "Eastmallbuy") {
    if (formattedShopType === "taobao") {
      to = `https://www.eastmallbuy.com/index/item/index.html?url=https://taobao.com/item.html?itemID=${id}&inviter=Findsly`;
    } else if (formattedShopType === "weidian") {
      to = `https://www.eastmallbuy.com/index/item/index.html?url=https://weidian.com/item.html?itemID=${id}&inviter=Findsly`;
    } else if (formattedShopType === "ali_1688" || "1688") {
      to = `https://www.eastmallbuy.com/index/item/index.html?url=https://detail.1688.com/offer/${id}.html&inviter=Findsly`;
    }
  }
  // Superbuy
  else if (selectedPlatform === "Superbuy") {
    if (formattedShopType === "taobao") {
      to = `https://www.cssbuy.com/item-${id}.html?promotionCode=d34d2363db4cdb95`;
    } else if (formattedShopType === "weidian") {
      to = `https://www.superbuy.com/en/page/buy/?url=https://weidian.com/item.html?itemID=${id}&partnercode=wcQdgk`;
    } else if (formattedShopType === "ali_1688" || "1688") {
      to = `https://www.cssbuy.com/item-1688-${id}.html?promotionCode=d34d2363db4cdb95`;
    }
  } else to = "/";
  return (
    <Link
      to={to}
      target="_blank"
      className="bg-btn hover:bg-green-500 duration-200 px-4 py-2 rounded-lg text-white flex justify-center items-center gap-5 w-full"
    >
      <img className="w-6 h-6 rounded" src={selectedImage} alt="" />
      Buy
    </Link>
  );
};

export default PlatformLink;

/*
https://oopbuy.com/goods/details?id=7291761033&channel=weidian&inviteCode=GW72B7VYF

https://www.acbuy.com/product?id=7291761033&source=WD&u=XRTG9T

https://www.ootdbuy.com/goods/details?id=7291761033&channel=weidian&inviteCode=FINDSLY

https://m.lovegobuy.com/product?id=7291761033&shop_type=weidian&invite_code=Q7W6G7

https://hippoobuy.com/en_US/goods/detail?keyword=https%3A%2F%2Fdetail.1688.com%2Foffer%2F770878528185.html&invitor_id=1305828

https://www.cssbuy.com/item-micro-7291761033.html?promotionCode=d34d2363db4cdb95

https://cnfans.com/product/?shop_type=weidian&id=7291761033&ref=72365

https://loongbuy.com/product-details?invitecode=F00T846H&url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D7291761033

https://mulebuy.com/product/?shop_type=weidian&id=7291761033&ref=200162669

https://joyabuy.com/product/?shop_type=weidian&id=7309392256&ref=300083887

https://www.eastmallbuy.com/index/item/index.html?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D7309392256&inviter=Findsly
https://www.eastmallbuy.com/index/item/index.html?url=https%3A%2F%2Fdetail.1688.com%2Foffer%2F646368135305.html&inviter=Findsly

https://www.superbuy.com/en/page/buy/?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D7255586158&partnercode=wcQdgk
*/

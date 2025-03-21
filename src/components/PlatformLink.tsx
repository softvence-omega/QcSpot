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

  let to;
  if (selectedPlatform === "Oopbuy")
    to = `https://oopbuy.com/goods/details?id=${id}&channel=${shopType?.toLowerCase()}&inviteCode=GW72B7VYF`;
  else if (selectedPlatform === "ACBuy")
    to = `https://www.acbuy.com/product?id=${id}&source=${shopType}&u=XRTG9T`; // Issue: Shoptype name need to be formatted. (weidian is WD)
  else if (selectedPlatform === "Ootdbuy")
    to = `https://www.ootdbuy.com/goods/details?id=${id}&channel=${shopType?.toLowerCase()}&inviteCode=FINDSLY`;
  else if (selectedPlatform === "Lovegobuy")
    to = `https://m.lovegobuy.com/product?id=${id}&shop_type=${shopType?.toLowerCase()}&invite_code=Q7W6G7`;
  else if (selectedPlatform === "Kakobuy")
    to = `https://www.kakobuy.com/item/details?url=https://${shopType?.toLowerCase()}.com/item.html?itemID=${id}&affcode=3j8gr`; // ISsue: Sometimes its ${shopType}.com, sometimes item.${shopType}.com
  else if (selectedPlatform === "CSSBuy")
    to = `https://www.cssbuy.com/item-${id}.html?promotionCode=d34d2363db4cdb95`; // Issue: Sometimes its item-${id}, sometimes item-micro-${id}
  else if (selectedPlatform === "CNFans")
    to = `https://cnfans.com/product/?shop_type=${shopType?.toLowerCase()}&id=${id}&ref=72365`;
  else if (selectedPlatform === "Loongbuy")
    to = `https://loongbuy.com/product-details?invitecode=F00T846H&url=https://${shopType?.toLowerCase()}.com/item.html?itemID=${id}`;
  else if (selectedPlatform === "Mulebuy")
    to = `https://mulebuy.com/product/?shop_type=${shopType?.toLowerCase()}&id=${id}&ref=200162669`;
  else
    to = `https://cnfans.com/product/?id=${id}&platform=${shopType}&ref=111111`;

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

https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D7291761033&affcode=3j8gr
https://www.kakobuy.com/item/details?url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D747713039880

https://www.cssbuy.com/item-micro-7291761033.html?promotionCode=d34d2363db4cdb95

https://cnfans.com/product/?shop_type=weidian&id=7291761033&ref=72365

https://loongbuy.com/product-details?invitecode=F00T846H&url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D7291761033

https://mulebuy.com/product/?shop_type=weidian&id=7291761033&ref=200162669
*/

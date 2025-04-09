import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAgent from "../hooks/useAgent";
import { IAgent } from "../types/agent.type";

interface PlatformLinkProps {
  id?: string;
  shopType?: string;
  className?: string;
}

const PlatformLink = ({ id, shopType, className }: PlatformLinkProps) => {
  const { agentData } = useAgent();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const formattedShopType = shopType?.toLowerCase();

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

  const agentToBeUsed = agentData?.find(
    (agent: IAgent) => agent.name === selectedPlatform
  );

  const generateToUrl = (): string => {
    if (!agentToBeUsed || !formattedShopType || !id) return "/";
    const shopTypeKey =
      formattedShopType === "ali_1688" ? "1688" : formattedShopType;
    const pattern = agentToBeUsed.to?.[shopTypeKey];
    if (!pattern) return "/";
    return pattern.replace(/\{id\}/g, id);
  };
  const to = generateToUrl();
  // console.log(to);

  return (
    <Link
      to={to}
      target="_blank"
      className={`flex justify-center items-center gap-2 md:gap-4 ${className}`}
    >
      <img className="w-6 h-6 rounded" src={selectedImage} alt="" />
      Buy
    </Link>
  );
};

export default PlatformLink;

import { Camera, Eye } from "lucide-react";
import PlatformLink from "./PlatformLink";
import { Link } from "react-router-dom";
import { IProduct } from "../types";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  console.log(product);
  const {
    _id,
    thumbnailImg,
    name,
    price,
    totalView,
    totalPhoto,
    storeName,
    productCode,
  } = product;
  return (
    <div className="bg-white dark:border-2 border-shadow rounded-lg shadow-md dark:shadow-shadow overflow-hidden">
      <div className="relative">
        <img
          src={thumbnailImg[0]}
          alt={name}
          className="w-full aspect-square object-cover object-center"
        />
      </div>
      <div className="p-2 sm:p-4 dark:bg-dark dark:text-white">
        <h3 className="font-medium line-clamp-2 h-10">{name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm sm:text-base flex items-center space-x-2">
            <span className="font-semibold">¥{price}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-gray-500 text-sm">
            <Eye size={16} />
            <span className="pr-1 sm:pr-2 lg:pr-3">{totalView}</span>
            <Camera size={16} />
            <span>{totalPhoto}</span>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/product/${storeName}/${productCode}`}
            className="flex-1 p-1 md:p-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 dark:text-white flex justify-center items-center"
          >
            View QC
          </Link>
          <PlatformLink
            className="flex-1 p-1 sm:p-2 bg-btn hover:bg-green-500 transition-colors duration-200 text-white rounded-md text-xs sm:text-sm font-medium"
            id={productCode}
            shopType={storeName}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

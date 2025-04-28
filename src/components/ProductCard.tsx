import { Eye } from "lucide-react";
import PlatformLink from "./PlatformLink";
import { Link } from "react-router-dom";
import { IProduct } from "../types";
import { TfiCommentAlt } from "react-icons/tfi";
import { Rating } from "@smastrom/react-rating";
import { ratingStyles } from "../pages/ProductDetailsPage";
import ReactGA from "react-ga4";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    _id,
    thumbnailImg,
    name,
    price,
    totalView,
    storeName,
    productCode,
    avgRetting,
    totalReview,
  } = product;

  const handleProductClick = () => {
    ReactGA.event("Product Click", {
      category: name,
      value: price,
    });
  };

  return (
    <div className="bg-white dark:border-2 border-shadow rounded-lg shadow-md dark:shadow-shadow overflow-hidden">
      <Link
        to={`/product/${
          storeName == "1688" ? "ali_1688" : storeName
        }/${productCode}?_id=${_id}`}
        className="relative cursor-pointer"
        onClick={handleProductClick}
      >
        <img
          src={thumbnailImg}
          alt={name}
          className="w-full aspect-square object-cover object-center transition-opacity duration-300 ease-in-out"
        />
      </Link>

      <div className="p-2 sm:p-4 dark:bg-dark dark:text-white">
        <Link
          to={`/product/${
            storeName == "1688" ? "ali_1688" : storeName
          }/${productCode}?_id=${_id}`}
          className="font-medium line-clamp-2 h-12"
          onClick={handleProductClick}
        >
          {name}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="text-sm sm:text-base flex items-center space-x-2">
            <span className="font-semibold">¥{price}</span>
          </div>
          {avgRetting ? (
            <Rating
              className="max-w-20"
              readOnly
              value={avgRetting || 0}
              itemStyles={ratingStyles}
            />
          ) : (
            <></>
          )}
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Eye size={16} />
            <span className="pr-1 sm:pr-2 lg:pr-3">{totalView}</span>
            <TfiCommentAlt />
            <span>{totalReview}</span>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/product/${
              storeName == "1688" ? "ali_1688" : storeName
            }/${productCode}?_id=${_id}`}
            className="flex-1 p-1 md:p-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 dark:text-white flex justify-center items-center"
            onClick={handleProductClick}
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

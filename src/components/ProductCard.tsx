import React from "react";
import { Camera, Eye, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  views: number;
  photos: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  views,
  photos,
}) => {
  // const platform = localStorage.getItem("platform");
  return (
    <div className="bg-white dark:border-2 border-shadow rounded-lg shadow-md dark:shadow-shadow overflow-hidden">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-64 object-cover" />
      </div>
      <div className="p-4 dark:bg-dark dark:text-white">
        <h3 className="text-sm font-medium line-clamp-2 h-10">{title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold ">¥{price}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <Eye size={16} />
            <span>{views}</span>
            <Camera size={16} />
            <span>{photos}</span>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-white">
            View QC
          </button>
          <button className="flex-1 px-4 py-2 bg-btn hover:bg-green-500 transition-colors duration-200 text-white rounded-md text-sm font-medium  flex items-center justify-center">
            <ShoppingCart size={16} className="mr-1" />
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

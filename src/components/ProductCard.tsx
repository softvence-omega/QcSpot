import React from "react";
import { Eye, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  views: number;
  likes: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  views,
  likes,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img src={image} alt={title} className="w-full h96 object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">
          {title}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">¥{price}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <Eye size={16} />
            <span>{views}</span>
            <span>•</span>
            <span>{likes}</span>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            View QC
          </button>
          <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 flex items-center justify-center">
            <ShoppingCart size={16} className="mr-1" />
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

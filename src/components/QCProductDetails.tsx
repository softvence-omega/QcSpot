import { useLocation } from "react-router-dom";
import { useState } from "react";
import { IQcProduct } from "../types";

const QcProductDetails = () => {
  const location = useLocation();
  const state = location.state as { product: IQcProduct } | null;
  const product = state?.product;

  // ✅ Initialize mainImage safely (fallback if product is missing)
  const [mainImage, setMainImage] = useState<string>(
    product?.image[0] || "" // Empty string if no product
  );

  if (!product) {
    return <p className="p-10 text-red-500">Product not found!</p>;
  }

  return (
    <div className="p-6 mt-28">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 lg:flex lg:gap-8">
          {/* Left Section: Image Gallery */}
          <div className="lg:w-1/2 flex flex-col">
            {/* ✅ Main Image */}
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
              <img
                src={mainImage}
                alt={product.skuInfo}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
              />
            </div>

            {/* ✅ Thumbnail Images */}
            {product.image.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.image.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Thumbnail ${i}`}
                    className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition-transform duration-200 ${
                      img === mainImage
                        ? "border-green-500 scale-105"
                        : "border-gray-300 hover:border-green-400 hover:scale-105"
                    }`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Section: Product Info */}
          <div className="lg:w-1/2 mt-6 lg:mt-0">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              {product.skuInfo}
            </h1>

            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p className="text-lg">
                <span className="font-semibold text-gray-800 dark:text-white">
                  Weight:
                </span>{" "}
                {product.weight} g
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-800 dark:text-white">
                  QC Time:
                </span>{" "}
                {new Date(product.qcTime * 1000).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QcProductDetails;

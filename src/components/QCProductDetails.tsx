import { useLocation } from "react-router-dom";
import { IQcProduct } from "../types";

const QcProductDetails = () => {
//   const { qcTime } = useParams<{ qcTime: string }>();
  const location = useLocation();
  const state = location.state as { product: IQcProduct };

  const product = state?.product;

  if (!product) return <p className="p-10">Product not found!</p>;

  return (
    <div className="p-6 mt-28">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 lg:flex lg:gap-8">
          {/* Left Section: Image Gallery */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Main Image */}
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
              <img
                src={product.image[0]}
                alt={product.skuInfo}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.image.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {product.image.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="QC"
                    className="w-20 h-20 object-cover rounded-lg border hover:border-green-500 hover:scale-105 transition-transform duration-200"
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

import { Link, useLocation } from "react-router-dom";
import { IQcSearchResponse } from "../types";

const QcSearchResult = () => {
  const location = useLocation();
  const state = location.state as { productData: IQcSearchResponse } | null;

  if (!state || !state.productData) {
    return (
      <div className="p-10 text-center text-red-500">
        No QC Search Data Found!
      </div>
    );
  }

  const { list } = state.productData;

  return (
    <div className="container mx-auto p-6 mt-12">
      <h1 className="text-2xl font-bold mb-6">QC Search Results</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 duration-300 flex flex-col"
          >
            {/* Image Section */}
            <div className="relative w-full h-56 overflow-hidden rounded-t-xl">
              <img
                src={item.image[0]}
                alt={item.skuInfo}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
              {/* Badge */}
              <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                QC
              </span>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col p-4">
              <Link
                to={`/qc-product/${item.qcTime}`}
                state={{ product: item }}
                className="font-semibold text-lg text-gray-800 dark:text-white hover:text-green-600 transition line-clamp-2 mb-2"
              >
                {item.skuInfo}
              </Link>

              {/* Weight & QC Time */}
              <div className="text-sm text-gray-500 space-y-1 mb-3">
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Weight:
                  </span>{" "}
                  {item.weight} g
                </p>
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    QC Time:
                  </span>{" "}
                  {new Date(item.qcTime * 1000).toLocaleDateString()}
                </p>
              </div>

              {/* Extra Images Preview */}
              {item.image.length > 1 && (
                <div className="flex gap-2 mt-auto overflow-x-auto">
                  {item.image.slice(1).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="extra"
                      className="w-14 h-14 object-cover rounded border hover:scale-105 transition-transform duration-200"
                    />
                  ))}
                </div>
              )}

              {/* Button */}
              <Link
                to={`/qc-product/${item.qcTime}`}
                state={{ product: item }}
                className="mt-4 inline-block w-full text-center bg-green-700 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QcSearchResult;

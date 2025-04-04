import { useState } from "react";
import { Users, CheckCircle, History, Shuffle } from "lucide-react";
import { IoMdTrendingUp } from "react-icons/io";
import useProduct from "../hooks/useProducts";
import { IProduct } from "../types";
import ProductCard from "../components/ProductCard";

const PopularPage = () => {
  const [compactMode, setCompactMode] = useState(false);
  // const [requireQC, setRequireQC] = useState(false);

  const [filters, setFilters] = useState({
    MinPrice: "",
    MaxPrice: "",
    Storefront: "",
  });

  // Clean filters for queryParams (remove empty fields)
  const queryParams = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== "")
  );

  console.log(queryParams);
  const { productData, productLoading } = useProduct(queryParams);
  return (
    <div className="max-w-7xl mx-auto pt-40 md:pt-24 pb-10 px-4">
      {/* Header Section */}
      <div className="p-6 border dark:border-shadow rounded-lg shadow-sm mb-6">
        <div className="text-center mb-4">
          <h1 className="text-lg font-semibold flex items-center justify-center gap-2">
            <IoMdTrendingUp className="w-6 h-6" />
            Discover Popular Products
          </h1>
          <p className="text-zinc-500">
            Browse what other shoppers are viewing right now
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto text-blue-500" />
            <p className="mt-2 text-sm">Trusted by 500K+ shoppers</p>
          </div>
          <div className="text-center">
            <CheckCircle className="w-6 h-6 mx-auto text-green-500" />
            <p className="mt-2 text-sm">All links verified active</p>
          </div>
          <div className="text-center">
            <History className="w-6 h-6 mx-auto text-purple-500" />
            <p className="mt-2 text-sm">Real-time updates</p>
          </div>
          <div className="text-center">
            <Shuffle className="w-6 h-6 mx-auto text-indigo-500" />
            <p className="mt-2 text-sm">Works with the agent of your choice</p>
          </div>
        </div>
        <div className="text-center mt-8 text-zinc-500 text-sm">
          Featuring products from Taobao, Weidian, 1688, and more
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-6 items-center mb-6">
        {/* Compact Mode */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="toggle toggle-sm border-white bg-white checked:bg-green-400 checked:text-btn checked:border-green-500"
            onChange={(e) => setCompactMode(e.target.checked)}
          />
          <span className="text-sm">Compact mode</span>
        </label>

        {/* Require QC */}
        {/* <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="toggle toggle-sm border-white bg-white checked:bg-green-400 checked:text-btn checked:border-green-500"
            checked={requireQC}
            onChange={(e) => setRequireQC(e.target.checked)}
          />
          <span className="text-sm">Require QC</span>
        </label> */}

        {/* Min & Max Price */}
        <div className="flex items-center space-x-2">
          <label className="text-sm">Min Price</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-20 sm:w-24 outline-none focus:border-green-500 bg-white dark:bg-black text-sm"
            value={filters?.MinPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, MinPrice: e.target.value }))
            }
          />

          <label className="text-sm pl-3">Max Price</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-20 sm:w-24 outline-none focus:border-green-500 bg-white dark:bg-black text-sm"
            value={filters?.MaxPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, MaxPrice: e.target.value }))
            }
          />
        </div>

        {/* Storefront Filter */}
        <div>
          <label className="text-sm pr-3">Storefront</label>
          <select
            value={filters?.Storefront}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, Storefront: e.target.value }))
            }
            className="border rounded px-2 py-1 outline-none focus:border-green-500 bg-white dark:bg-black text-sm"
          >
            <option value="">All</option>
            <option value="taobao">Taobao</option>
            <option value="weidian">Weidian</option>
            <option value="1688">1688</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}

      <div
        className={`grid ${
          compactMode
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        } gap-2`}
      >
        {productLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="border p-2 rounded shadow animate-pulse"
              >
                <div className="h-48 bg-gray-300 rounded-md"></div>
                <div className="h-4 bg-gray-300 my-2 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="flex justify-between gap-3 mt-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))
          : productData.map((product: IProduct, index: number) => (
              <ProductCard key={index} product={product} />
            ))}
      </div>
    </div>
  );
};

export default PopularPage;

import useProduct from "../../hooks/useProducts";
import ManageProductCard from "../../components/ManageProductCard";
import Loader from "../../components/Loader";
import { useState } from "react";

export interface IProduct {
  _id: string;
  name: string;
  productCode: string;
  price: number;
  inStock: number;
  storeName: string;
  shippingTime: number;
  weight: number;
  dimensions: string;
  isDeleted: boolean;
  onTrend: boolean;
  totalView: number;
  totalPhoto: number;
  searchField: string[];
  thumbnailImg: string[];
  variants: string[];
  createdAt: string;
  updatedAt: string;
  lastUpdatedAt: number;
  __v: number;
}

const ManageProducts = () => {
  const [filters, setFilters] = useState({ Trending: "" });
  const queryParams = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== "")
  );

  const { productData, productLoading, productRefetch } =
    useProduct(queryParams);
  if (productLoading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-10">
        Manage Products
      </h2>

      {/* Filter */}
      <div className="flex items-center justify-end mb-6 mx-6">
        <select
          value={filters?.Trending}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, Trending: e.target.value }))
          }
          className="border rounded px-2 py-1 outline-none focus:border-green-500 bg-white dark:bg-black text-sm"
        >
          <option value="">All</option>
          <option value="true">Trending</option>
          <option value="false">Not Trending</option>
        </select>
      </div>

      {/* Products */}
      <section>
        {productData.length > 0 ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 place-items-center">
            {productData.map((product: IProduct) => (
              <ManageProductCard
                key={product?._id}
                product={product}
                refetch={productRefetch}
              />
            ))}
          </div>
        ) : (
          <div>
            <p className="text-center">No Product Found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageProducts;

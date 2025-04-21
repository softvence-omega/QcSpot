import useProduct from "../../hooks/useProducts";
import ManageProductTableRow from "../../components/ManageProductTableRow";
import Loader from "../../components/Loader";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
  thumbnailImg: string;
  serial_No?: number;
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
      {productLoading ? (
        <div className="flex justify-center items-center py-20 text-4xl">
          <Loader2 className="w-16 h-16 animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          {productData.length > 0 ? (
            <table className="text-center text-black dark:text-white w-full">
              {/* head */}
              <thead>
                <tr className="text-sm sm:text-base bg-zinc-200 dark:bg-zinc-700 border-b dark:border-shadow h-12">
                  <th>Sl</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {productData?.map((product: IProduct, index: number) => (
                  <ManageProductTableRow
                    key={product?._id}
                    index={index}
                    product={product}
                    refetch={productRefetch}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <p className="text-center">No Product Found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;

import { Loader2 } from "lucide-react";
import useProduct from "../../hooks/useProducts";
import ManageProductCard from "../../sections/dashboard/manageProducts/ManageProductCard";

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
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  lastUpdatedAt: number; // Unix timestamp
  __v: number;
}

const ManageProducts = () => {
  const { productData, productLoading, productRefetch } = useProduct();

  if (productLoading)
    return (
      <div className="flex justify-center items-center py-40 text-4xl">
        <Loader2 className="w-20 h-20 animate-spin" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-10">
        Manage Products
      </h2>

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

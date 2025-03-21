import { Loader2, Plus, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PLatformLink from "../components/PLatformLink";

interface Product {
  title: string;
  price: number;
  imgList: string[];
}

const ProductDetails = () => {
  const { shopType, id } = useParams<{ shopType: string; id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://cnfans.com/search-api/detail/product-info?platform=${shopType}&productID=${id}&forceReload=false&site=cnfans&lang=en&wmc-currency=USD`
          // `https://cnfans.com/search-api/detail/product-info?platform=TAOBAO&productID=${id}&forceReload=false&site=cnfans&lang=en&wmc-currency=USD`
        );
        const data = await response.json();
        setProduct(data?.data?.productInfo || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-40 text-4xl">
        <Loader2 className="w-20 h-20 animate-spin" />
      </div>
    );
  if (!product)
    return <div className="text-center py-10 text-4xl">Product not found.</div>;

  return (
    <div className="pt-40 md:pt-24 pb-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden border dark:border-shadow dark:shadow-shadow">
        {/* Product Image */}
        {product?.imgList?.[0] && (
          <img
            className="w-96 md:w-64 object-cover md:rounded-t-lg md:rounded-l-lg md:rounded-tr-none mx-auto"
            src={product?.imgList[0]}
            alt={product?.title}
          />
        )}

        {/* Product Details */}
        <div className="p-5 flex flex-col flex-1">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            {product?.title}
          </h2>
          <p className="text-gray-600 mb-4">Last updated 1 hour ago</p>

          {/* Price */}
          <button className="rounded-lg text-xl font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-2 mb-5 transition duration-300 w-fit text-black">
            ¥ {product?.price}
          </button>

          {/* Action Buttons */}
          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <PLatformLink id={id} shopType={shopType} />
            <button className="bg-gray-500 px-4 py-2 rounded-lg text-white flex justify-center items-center gap-2 w-full">
              <Plus /> Add to Collection
            </button>
            <button className="bg-gray-500 px-4 py-2 rounded-lg text-white flex justify-center items-center gap-2 w-full">
              <Share2 /> Affiliate Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

import { Loader2, Plus, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PLatformLink from "../components/PlatformLink";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

interface Product {
  title: string;
  price: number;
  imgList: string[];
}

const ProductDetails = () => {
  const { shopType, id } = useParams<{ shopType: string; id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [qc, setQc] = useState<string[] | null>(null);
  const [productLoading, setProductLoading] = useState<boolean>(true);
  const [qcLoading, setQcLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://cnfans.com/search-api/detail/product-info?platform=${shopType}&productID=${id}&forceReload=false&site=cnfans&lang=en&wmc-currency=USD`
        );
        const data = await res.json();
        setProduct(data?.data?.productInfo || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setProductLoading(false);
      }
    };

    const fetchQcPhotos = async () => {
      try {
        const response = await axios.get(
          `https://qc-spot-proxy-server.vercel.app/api/qc-photos/${id}`
        );
        const data = response.data.data.photos;
        setQc(data);
      } catch (error) {
        console.error("Error fetching QC photos:", error);
        setQc(null); // Set QC photos to null if there's an error
      } finally {
        setQcLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      fetchQcPhotos();
    }
  }, [id]);

  if (productLoading)
    return (
      <div className="flex justify-center items-center py-40 text-4xl">
        <Loader2 className="w-20 h-20 animate-spin" />
      </div>
    );

  if (!product)
    return <div className="text-center py-10 text-4xl">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto pt-40 md:pt-24 pb-10 px-4">
      <div className="flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden border dark:border-shadow dark:shadow-shadow">
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
          <p className="text-gray-600 mb-4">Last updated 5 days ago</p>

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

      {/* QC Photos Section */}
      {qcLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-16 h-16 animate-spin" />
        </div>
      ) : qc && qc.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mt-5">QC Photos:</h2>
          <div className="grid gris-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-3">
            {qc.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`product-image`}
                className="w-full h-[480px] object-cover rounded hover:shadow-xl"
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center py-10 text-xl">No QC photos available</p>
      )}
    </div>
  );
};

export default ProductDetails;

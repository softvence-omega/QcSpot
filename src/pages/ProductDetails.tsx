import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://cnfans.com/search-api/detail/product-info?platform=TAOBAO&productID=${id}&forceReload=false&site=cnfans&lang=en&wmc-currency=USD`
        );
        const data = await response.json();
        setProduct(data?.data || null);
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

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  console.log(product.skus);

  return (
    <div className="container mt-28">
      <div className="max-w-5xl mx-auto flex rounded-lg border border-gray-400">
        <img
          className="w-60 rounded-l-lg"
          src={product?.productInfo?.imgList[0]}
          alt=""
        />

        <div className="relative p-5">
          <h2 className="text-xl mb-5">{product?.productInfo?.title}</h2>
          <p className="mb-8">Last updated 1 hour ago</p>
          <button className="rounded-lg text-xl font-semibold">
            ¥ {product?.productInfo?.price}
          </button>

          <div className="absolute bottom-5 flex items-center gap-10">
            <button className="bg-orange-500 px-5 py-2 rounded-lg text-white cursor-pointer">
              Buy
            </button>
            <button className="bg-gray-500 px-5 py-2 rounded-lg text-white cursor-pointer">
              Add to Collection
            </button>
            <button className="bg-gray-500 px-5 py-2 rounded-lg text-white cursor-pointer">
              Affiliate Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

import { Clock, Loader2, Plus, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PLatformLink from "../components/PlatformLink";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface Product {
  title: string;
  price: number;
  imgList: string[];
}

type Sku = {
  group: {
    name: string;
    name_cn?: string; // Optional for Chinese name
  };
  value: {
    name: string;
    name_cn?: string; // Optional for Chinese name
  };
};

type ProductData = {
  create_time: string;
  sku_id: string;
  sku: Sku[];
  imgs: string[];
};

// Custom Next and Prev Buttons
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
    >
      <FiArrowRight className="size-8 rounded-full border-2 text-primary dark:text-black border-primary p-1 bg-white shadow-md hover:bg-gray-100 duration-300" />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
    >
      <FiArrowLeft className="size-8 rounded-full border-2 text-primary dark:text-black border-primary p-1 bg-white shadow-md hover:bg-gray-100 duration-300" />
    </button>
  );
};

const ProductDetails = () => {
  const { shopType, id } = useParams<{ shopType: string; id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [qc, setQc] = useState<ProductData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response1 = await fetch(
          `https://cnfans.com/search-api/detail/product-info?platform=${shopType}&productID=${id}&forceReload=false&site=cnfans&lang=en&wmc-currency=USD`
        );
        const response2 = await fetch(
          `https://www.lovegobuy.com/index.php?s=/api/open/qc&shopType=${shopType}&goodsId=${id}`
        );
        const data1 = await response1.json();
        const data2 = await response2.json();
        setProduct(data1?.data?.productInfo || null);
        setQc(data2.data);
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

  const calculateDaysAgo = (createTime: string) => {
    const productDate = new Date(createTime);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - productDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
    return daysDifference;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-40 text-4xl">
        <Loader2 className="w-20 h-20 animate-spin" />
      </div>
    );
  if (!product)
    return <div className="text-center py-10 text-4xl">Product not found.</div>;

  // Slick settings
  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

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

      <div className="grid gris-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qc &&
          qc.length > 0 &&
          qc.map((product, index) => (
            <div key={index} className="my-20">
              <Slider {...settings}>
                {product.imgs.map((img, imgIndex) => (
                  <div key={imgIndex}>
                    <img
                      src={img}
                      alt={`product-image-${imgIndex}`}
                      className="w-full h-[480px] object-cover"
                    />
                  </div>
                ))}
              </Slider>
              <h3 className="text-center mb-2 mt-5">{`Product SKU: ${product.sku_id}`}</h3>
              <div className="flex justify-center items-center gap-3">
                <Clock />
                <p>{calculateDaysAgo(product?.create_time)} days ago</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductDetails;

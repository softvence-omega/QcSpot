import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { TProduct } from "../../types/product.type";
import Slider from "react-slick";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const Trending = () => {
  const [products, setProducts] = useState<TProduct[]>([]);

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // Slick settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1500, settings: { slidesToShow: 4 } },
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="pt-32 md:pt-20">
      <div className="border dark:border-shadow shadow dark:shadow-shadow rounded m-4">
        <h2 className="relative text-center w-fit mx-auto duration-300 text-2xl font-bold my-6">
          Trending Products
          <span className="block mt-3 md:mt-0 md:absolute bottom-1 -right-24 text-sm hover:underline hover:text-green-600 text-btn dark:text-white/80 duration-300 cursor-pointer">
            View all →
          </span>
        </h2>

        <div className="mx-auto px-2 relative">
          <Slider {...settings} className="pb-10 px-12">
            {products.map((product, index) => (
              <div key={index} className="px-2">
                <ProductCard
                  image={product.thumbnail}
                  title={product.name}
                  price={product.price}
                  views={product.views}
                  photos={product.totalImages}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Trending;

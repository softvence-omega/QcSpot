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
      <FiArrowRight className="size-8 rounded-full border-2 text-primary border-primary p-1 bg-white shadow-md hover:bg-gray-100 duration-300" />
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
      <FiArrowLeft className="size-8 rounded-full border-2 text-primary border-primary p-1 bg-white shadow-md hover:bg-gray-100 duration-300" />
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
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1440, settings: { slidesToShow: 3 } },
      { breakpoint: 940, settings: { slidesToShow: 2 } },
      { breakpoint: 680, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="container">
      <h2 className="relative text-center w-fit mx-auto pt-40 md:pt-28 duration-300 text-4xl mb-6">
        Trending Products{" "}
        <span className="block mt-3 md:mt-0 md:absolute bottom-0 -right-16 text-sm underline text-green-700 hover:text-green-500 duration-300 cursor-pointer">
          View all
        </span>
      </h2>

      <div className="max-w-7xl mx-auto px-4 relative">
        <Slider {...settings} className="pb-10">
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
  );
};

export default Trending;

import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from "../../components/SlickComponents";
import { Link } from "react-router-dom";
import { IProduct } from "../../types";

const Trending = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

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
          <Link
            to="popular"
            className="block mt-3 md:mt-0 md:absolute bottom-1 -right-24 text-sm hover:underline hover:text-green-600 text-btn dark:text-white/80 duration-300 cursor-pointer"
          >
            View all →
          </Link>
        </h2>

        <div className="mx-auto px-2 relative">
          <Slider {...settings} className="pb-10 px-6 md:px-12">
            {products.map((product, index) => (
              <div key={index} className="px-2">
                <ProductCard
                  image={product.thumbnailImg[0]}
                  title={product.name}
                  price={product.price}
                  views={product.totalView}
                  photos={product.totalPhoto}
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

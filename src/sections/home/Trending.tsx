import ProductCard from "../../components/ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from "../../components/SlickComponents";
import { Link } from "react-router-dom";
import { IProduct } from "../../types";
import useProduct from "../../hooks/useProducts";

const Trending = () => {
  const { productData, productLoading } = useProduct({ Trending: "true" });
  // { Trending: "true" }

  // Slick settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
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
          {productLoading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mx-10">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="border p-2 rounded shadow animate-pulse"
                >
                  <div className="h-48 bg-gray-300 rounded-md"></div>
                  <div className="h-4 bg-gray-300 my-2 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="flex justify-between gap-3 mt-2">
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Slider {...settings} className="pb-10 px-6 md:px-12">
              {productData.map((product: IProduct) => (
                <div key={product?._id} className="px-2">
                  <ProductCard key={product?._id} product={product} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trending;

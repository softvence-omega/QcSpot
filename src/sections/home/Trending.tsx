import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { TProduct } from "../../types/product.type";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

// Swiper Button styling
const SwiperNavButtons = () => {
  const swiper = useSwiper();
  return (
    <section className="flex justify-end items-center gap-5 mt-4 mr-4">
      <button onClick={() => swiper.slidePrev()}>
        <FiArrowLeft className="size-8 rounded-full  border-2 text-primary border-primary p-1" />
      </button>
      <button onClick={() => swiper.slideNext()}>
        <FiArrowRight className="size-8 rounded-full  border-2 text-primary border-primary p-1" />
      </button>
    </section>
  );
};

const Trending = () => {
  const [products, setProducts] = useState<TProduct[]>([]);

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="container">
      <h2 className="relative text-center w-fit mx-auto pt-40 md:pt-28 duration-300 text-4xl mb-6">
        Trending Products{" "}
        <span className="absolute bottom-0 -right-16 text-sm underline text-green-700 hover:text-green-500 duration-300 cursor-pointer">
          View all
        </span>
      </h2>

      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-10"
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <ProductCard
                image={product.thumbnail}
                title={product.name}
                price={product.price}
                views={product.views}
                photos={product.totalImages}
              />
            </SwiperSlide>
          ))}
          <SwiperNavButtons />
        </Swiper>
      </div>
    </div>
  );
};

export default Trending;

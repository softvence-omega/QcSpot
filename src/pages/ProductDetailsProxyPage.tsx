import { useParams } from "react-router-dom";
import { FaTruck, FaWeightHanging } from "react-icons/fa";
import { RxDimensions } from "react-icons/rx";
import { Camera, Eye } from "lucide-react";
import { AiOutlineStock } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IVarient } from "../types";
import useSingleProduct from "../hooks/useSingleProduct";
import { ProdNextArrow, ProdPrevArrow } from "../components/SlickComponents";
import Slider from "react-slick";
import { useState } from "react";
import Loader from "../components/Loader";

const ProductDetailsProxyPage = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState({ img: "", state: false });
  const { singleProductData, singleProductLoading } = useSingleProduct(
    id as string
  );
  if (singleProductLoading) return <Loader />;
  if (!singleProductData)
    return (
      <p className="text-center text-2xl font-semibold my-20">
        Product not found.
      </p>
    );

  const varientKeys = Object.keys(singleProductData.filterDataFields);
  const {
    name,
    price,
    inStock,
    shippingTime,
    weight,
    dimensions,
    onTrend,
    totalView,
    totalPhoto,
    thumbnailImg,
  } = singleProductData.product;

  // Slick settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <ProdNextArrow />,
    prevArrow: <ProdPrevArrow />,
  };

  return (
    <section className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      {/*-------------------------- Top Section - Product Details ------------------*/}
      <section className="flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden border dark:border-shadow dark:shadow-shadow">
        {/* Product Image */}
        {thumbnailImg && (
          <img
            className="w-full max-w-96 p-3 mt-2 md:mt-0 max-h-96 object-cover object-center mx-auto"
            src={thumbnailImg[0]}
            alt={name}
          />
        )}

        {/* Product Description */}
        <div className="p-5 flex flex-col flex-1">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">{name}</h2>
          {/* Views and Photos Count */}
          <div className="flex items-center space-x-2  text-sm">
            <Eye size={16} />
            <span className="pr-6">{totalView}</span>
            <Camera size={16} />
            <span>{totalPhoto}</span>
          </div>

          <div className="grid grid-cols-2 gap-5 items-center justify-between my-5">
            {/* Price */}
            <button className="w-full flex justify-center items-center gap-2 rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-4 py-2 transition text-black">
              ¥ {price}
            </button>
            {/* Weight */}
            <button className="w-full flex justify-center items-center gap-2  rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-4 py-2 transition text-black">
              <FaWeightHanging />
              {weight} g
            </button>
            {/* Dimensions */}
            <button className="w-full flex justify-center items-center gap-2  rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-4 py-2 transition text-black">
              <RxDimensions /> {dimensions}
            </button>
            {/* Shipping Time */}
            <button className="w-full flex justify-center items-center gap-2  rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-4 py-2 transition text-black">
              <FaTruck /> {shippingTime} days
            </button>
            {/* Stock */}
            <button className="w-full flex justify-center items-center gap-2  rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-4 py-2 transition text-black">
              <AiOutlineStock />
              {inStock ? "In Stock" : "Out of Stock"}
            </button>
            {/* trending */}
            <button className="w-full flex justify-center items-center gap-2  rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-4 py-2 transition text-black">
              <FaArrowTrendUp />
              {onTrend ? "Trending" : "Not Trending"}
            </button>
          </div>
        </div>
      </section>

      {/*-------------------------- Mid Section - Variants --------------------*/}
      <section className="mt-10 mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          QC Photos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {singleProductData?.variants.map((varient: IVarient) => (
            <div className="relative flex flex-col gap-3">
              {varient?.photos.length > 1 && (
                <Slider {...settings} key={varient?._id} className="">
                  {varient?.photos?.map((img: string, index: number) => (
                    <img
                      key={index}
                      className="h-96 sm:h-[420px] md:h-96 xl:h-[420px] object-cover object-center px-2 rounded-lg cursor-pointer"
                      src={img}
                      onClick={() => setIsOpen({ img, state: true })}
                      alt="IMAGE"
                    />
                  ))}
                </Slider>
              )}
              {varient?.photos.length == 1 && (
                <img
                  key={varient?._id}
                  className="w-full h-96 sm:h-[420px] md:h-96 xl:h-[420px] object-cover object-center px-2 rounded-lg cursor-pointer"
                  src={varient?.photos[0]}
                  onClick={() =>
                    setIsOpen({ img: varient?.photos[0], state: true })
                  }
                  alt="IMAGE"
                />
              )}
              <p className="mx-auto">
                <b>Quantity:</b> {varient?.quantity};{" "}
                {varientKeys.map((key) => (
                  <span>
                    <b>{key}</b>: {varient[`${key}`]};{" "}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </section>
      {isOpen.state && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsOpen({ img: "", state: false })}
        >
          <div
            className="rounded-lg shadow-lg max-w-xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={isOpen?.img}
              alt={`product-image`}
              className="w-full h-full object-cover rounded hover:shadow-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetailsProxyPage;

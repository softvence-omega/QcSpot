import { useParams } from "react-router-dom";
import axiosSecure from "../../hooks/useAxios";
import { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import { ProductImage, TSingleProduct } from "../../types";
import { FaTruck, FaWeightHanging } from "react-icons/fa";
import { RxDimensions } from "react-icons/rx";
import { Camera, Eye, Key, Loader2, X } from "lucide-react";
import { AiOutlineStock } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
import Slider from "react-slick";
import { ProdNextArrow, ProdPrevArrow } from "../../components/SlickComponents";
import { useForm } from "react-hook-form";
import {
  handleMultipleImagesChange,
  removeProductImage,
} from "../../components/ProductFormUtils";
import toast from "react-hot-toast";

const ManageProductsDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<TSingleProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [varientLoading, setVarientLoading] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const productImagesRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();

  const handleMultipleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMultipleImagesChange(
      e,
      productImages,
      setProductImages,
      productImagesRef
    );
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosSecure
      .get(`/products/findProductById?product_Id=${id}`)
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, varientLoading]);

  if (loading) return <Loader />;

  if (!product)
    return (
      <p className="text-center text-2xl font-semibold my-20">
        Product not found.
      </p>
    );

  console.log(product);
  const varientKeys = Object.keys(product.filterDataFields);
  console.log(varientKeys);

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

  const {
    _id,
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
  } = product.product;

  // ------------ Submit Handler -----------------
  const onSubmit = async (data: any) => {
    const formData = new FormData();

    // Append product images
    productImages.forEach((image) => formData.append("files", image.file));

    const varientInfo = {
      quantity: data.quantity,
      ...varientKeys.reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {} as Record<string, string>),
    };

    formData.append("data", JSON.stringify(varientInfo));

    try {
      setVarientLoading(true);
      const res = await axiosSecure.post(
        `/products/addProductVarient?product_id=${_id}`,
        formData
      );
      if (res.status !== 200) throw new Error("Network response was not ok");
      toast.success("Varient added successfully!");
      reset();
      setProductImages([]);
      if (productImagesRef.current) productImagesRef.current.value = "";
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add product";
      toast.error(errorMessage);
    } finally {
      setVarientLoading(false);
    }
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
          {product?.variants.map((varient, i) => (
            <div className="flex flex-col gap-3">
              {/* <h4>{varient?.name}</h4> */}
              {varient?.photos.length > 1 && (
                <Slider {...settings} key={i} className="">
                  {varient?.photos?.map((img: string, index: number) => (
                    <img
                      key={index}
                      className="h-96 sm:h-[420px] md:h-96 xl:h-[420px] object-cover object-center px-2 rounded-lg cursor-grab"
                      src={img}
                      alt="IMAGE"
                    />
                  ))}
                </Slider>
              )}
              {varient?.photos.length == 1 && (
                <img
                  key={i}
                  className="w-full h-96 sm:h-[420px] md:h-96 xl:h-[420px] object-cover object-center px-2 rounded-lg cursor-grab"
                  src={varient?.photos[0]}
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
      {/*------------------ Bottom Section - Add a Varient ------------------*/}
      <div className="rounded border-2 border-dashed p-5 max-w-5xl mx-auto mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Add a Varient
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {/* Quantity */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 0, message: "Quantity must be positive" },
              })}
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">
                {errors.quantity.message as string}
              </p>
            )}
          </div>

          {/* Other keys */}
          {varientKeys.map((key, index) => (
            <div key={index} className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {key} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(key, {
                  required: `${key} is required`,
                })}
                className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black"
              />
              {errors[key] && (
                <p className="text-red-500 text-sm">
                  {errors[key].message as string}
                </p>
              )}
            </div>
          ))}
          {/* Additional Product Images */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Additional Product Images (Max 10)
            </label>
            {productImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {productImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt={`Product Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        removeProductImage(index, setProductImages)
                      }
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              ref={productImagesRef}
              onChange={handleMultipleImages}
              className="hidden"
            />
            <button
              type="button"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500"
              onClick={() => productImagesRef.current?.click()}
            >
              Add Qc Images
            </button>
          </div>
          <button
            type="submit"
            className="col-span-3 w-full bg-btn text-white py-2 rounded hover:bg-green-500 transition mt-6"
          >
            {varientLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              "Add Varient"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ManageProductsDetails;

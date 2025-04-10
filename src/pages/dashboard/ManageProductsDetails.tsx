import { useParams } from "react-router-dom";
import axiosSecure from "../../hooks/useAxios";
import { useRef, useState } from "react";
import Loader from "../../components/Loader";
import { IVarient, ProductImage } from "../../types";
import {
  FaCode,
  FaEdit,
  FaShoppingCart,
  FaTruck,
  FaWeightHanging,
} from "react-icons/fa";
import { RxDimensions } from "react-icons/rx";
import { Camera, Eye, Loader2, X } from "lucide-react";
import { AiOutlineStock } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import {
  handleMultipleImagesChange,
  removeProductImage,
} from "../../components/ProductFormUtils";
import toast from "react-hot-toast";
import VarientCard from "../../components/VarientCard";
import useSingleProduct from "../../hooks/useSingleProduct";
import { useAuth } from "../../context/AuthContext";
import ProductEdit from "../../components/ProductEdit";

const ManageProductsDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [varientLoading, setVarientLoading] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const productImagesRef = useRef<HTMLInputElement | null>(null);
  const { singleProductData, singleProductLoading, singleProductRefetch } =
    useSingleProduct(id as string);

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

  if (singleProductLoading) return <Loader />;
  if (!singleProductData)
    return (
      <p className="text-center text-2xl font-semibold my-20">
        Product not found.
      </p>
    );
  const {
    _id,
    name,
    price,
    inStock,
    shippingTime,
    weight,
    storeName,
    productCode,
    dimensions,
    onTrend,
    totalView,
    totalPhoto,
    thumbnailImg,
  } = singleProductData.product;
  const varientKeys = Object.keys(singleProductData.filterDataFields);

  // ------------ Varient Submit Handler -----------------
  const onVarientSubmit = async (data: any) => {
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
      {!isEditClicked ? (
        <section className="relative flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden border dark:border-shadow dark:shadow-shadow">
          {/* Product Image */}
          <img
            className="w-full max-w-96 p-3 mt-2 md:mt-0 max-h-96 object-cover object-center mx-auto"
            src={thumbnailImg[0]}
            alt={name}
          />

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

            <div className="grid grid-cols-2 gap-3 md:gap-5 items-center justify-between my-5">
              {/* Price */}
              <p className="w-full flex justify-center items-center gap-2 rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-2 md:px-4 py-1 md:py-2 transition text-black text-sm md:text-base">
                ¥ {price}
              </p>
              {/* Weight */}
              <p className="w-full flex justify-center items-center gap-2  rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-2 md:px-4 py-1 md:py-2 transition text-black text-sm md:text-base">
                <FaWeightHanging />
                {weight} g
              </p>
              {/* Dimensions */}
              <p className="w-full flex justify-center items-center gap-2  rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-2 md:px-4 py-1 md:py-2 transition text-black text-sm md:text-base">
                <RxDimensions /> {dimensions}
              </p>
              {/* Shipping Time */}
              <p className="w-full flex justify-center items-center gap-2  rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-2 md:px-4 py-1 md:py-2 transition text-black text-sm md:text-base">
                <FaTruck /> {shippingTime} days
              </p>
              {/* Stock */}
              <p className="w-full flex justify-center items-center gap-2  rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-2 md:px-4 py-1 md:py-2 transition text-black text-sm md:text-base">
                <AiOutlineStock />
                {inStock ? "In Stock" : "Out of Stock"}
              </p>
              {/* trending */}
              <p className="w-full flex justify-center items-center gap-2  rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-2 md:px-4 py-1 md:py-2 transition text-black text-sm md:text-base">
                <FaArrowTrendUp />
                {onTrend ? "Trending" : "Not Trending"}
              </p>
              <p className="w-full flex justify-center items-center gap-2 rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-2 md:px-4 py-1 md:py-2 transition text-black text-sm md:text-base">
                <FaShoppingCart /> {storeName}
              </p>
              <p className="w-full flex justify-center items-center gap-2 rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-2 md:px-4 py-1 md:py-2 transition text-black text-sm md:text-base">
                <FaCode /> {productCode}
              </p>
            </div>
          </div>
          <div
            onClick={() => setIsEditClicked(true)}
            className="absolute top-2 right-2 cursor-pointer"
          >
            <FaEdit className="text-green-500 rounded p-1 text-2xl" />
          </div>
        </section>
      ) : (
        <ProductEdit
          product={singleProductData.product}
          setIsEditClicked={setIsEditClicked}
          refetch={singleProductRefetch}
        />
      )}

      {/*-------------------------- Mid Section - Variants --------------------*/}
      <section className="mt-10 mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          QC Photos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {singleProductData?.variants.map((varient: IVarient) => (
            <VarientCard
              varient={varient}
              varientKeys={varientKeys}
              refetch={singleProductRefetch}
            />
          ))}
        </div>
      </section>
      {/*------------------ Bottom Section - Add a Varient ------------------*/}
      {user?.role === "admin" && (
        <div className="rounded border-2 border-dashed p-5 max-w-5xl mx-auto mt-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Add a Varient
          </h2>
          <form
            onSubmit={handleSubmit(onVarientSubmit)}
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
      )}
    </section>
  );
};

export default ManageProductsDetails;

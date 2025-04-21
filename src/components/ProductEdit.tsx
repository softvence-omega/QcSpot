import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { IProduct } from "../types";
import { Dispatch, SetStateAction, useRef, useState } from "react";

import { handleImageChange, removeImage } from "./ProductFormUtils";
import toast from "react-hot-toast";
import axiosSecure from "../hooks/useAxios";

interface ProductEditProps {
  product: IProduct;
  setIsEditClicked: Dispatch<SetStateAction<boolean>>;
  refetch: () => void;
}

interface IProductEdit {
  name: string;
  price: number;
  dimensions: string;
  shippingTime: number;
  weight: number;
  storeName: string;
  productCode: string;
}

const ProductEdit = ({
  product,
  setIsEditClicked,
  refetch,
}: ProductEditProps) => {
  const [loading, setLoading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [hoverImagePreview, setHoverImagePreview] = useState<string | null>(
    null
  );
  const mainImageRef = useRef<HTMLInputElement | null>(null);
  const hoverImageRef = useRef<HTMLInputElement | null>(null);

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e, setMainImagePreview, mainImageRef);
  };
  const handleHoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e, setHoverImagePreview, hoverImageRef);
  };
  const removeMainImage = () => {
    removeImage(setMainImagePreview, mainImageRef);
  };
  const removeHoverImage = () => {
    removeImage(setHoverImagePreview, hoverImageRef);
  };

  const {
    _id,
    name,
    price,
    dimensions,
    shippingTime,
    weight,
    productCode,
    storeName,
  } = product;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProductEdit>();

  // ------------- Product Edit Handler ---------------
  const onProductEditSubmit = async (data: IProductEdit) => {
    const formData = new FormData();
    // Append thumbnails
    const thumbnails: File[] = [];
    if (mainImageRef.current?.files?.[0])
      thumbnails.push(mainImageRef.current.files[0]);
    if (hoverImageRef.current?.files?.[0])
      thumbnails.push(hoverImageRef.current.files[0]);
    thumbnails.forEach((file) => formData.append("thumbnailImg", file));

    const productInfo = {
      name: data.name,
      price: data.price,
      weight: data.weight,
      shippingTime: data.shippingTime,
      dimensions: data.dimensions,
      storeName: data.storeName,
      productCode: data.productCode,
    };

    formData.append("data", JSON.stringify(productInfo));

    try {
      setLoading(true);
      const res = await axiosSecure.patch(
        `/products/updateProduct?product_id=${_id}`,
        formData
      );
      if (res.status !== 200) toast.error("Network response was not ok");
      toast.success("Product updated successfully!");
      refetch();
      setIsEditClicked(false);
      reset();
      setMainImagePreview(null);
      setHoverImagePreview(null);
      if (mainImageRef.current) mainImageRef.current.value = "";
      if (hoverImageRef.current) hoverImageRef.current.value = "";
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update product";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onProductEditSubmit)}
      className="relative flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden border dark:border-shadow dark:shadow-shadow"
    >
      {/* Product Image */}
      <div className="flex flex-col justify-center items-center w-full flex-1 p-3 mt-2 md:mt-0 max-h-96 object-cover object-center mx-auto">
        {/* Main Image */}
        <div className="w-60 mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Main Image <span className="text-red-500">*</span>
          </label>
          {mainImagePreview && (
            <div className="mb-2 relative inline-block">
              <img
                src={mainImagePreview}
                alt="Main Preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={removeMainImage}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={mainImageRef}
            onChange={handleMainImage}
            className="hidden"
          />
          <button
            type="button"
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
            onClick={() => mainImageRef.current?.click()}
          >
            Add Product Thumbnail
          </button>
        </div>

        {/* Hover Image */}
        <div className="w-60">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hover Image <span className="text-red-500">*</span>
          </label>
          {hoverImagePreview && (
            <div className="mb-2 relative inline-block">
              <img
                src={hoverImagePreview}
                alt="Hover Preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={removeHoverImage}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={hoverImageRef}
            onChange={handleHoverImage}
            className="hidden"
          />
          <button
            type="button"
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
            onClick={() => hoverImageRef.current?.click()}
          >
            Add Thumbnail hover
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div className="p-5 flex flex-col flex-1">
        {/* <h2 className="text-xl md:text-2xl font-semibold mb-2">{name}</h2> */}
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name", { required: "Product name is required" })}
            defaultValue={name}
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-5 items-center justify-between my-5">
          {/* Price */}
          {/* <p className="w-full flex justify-center items-center gap-2 rounded-lg font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-2 md:px-4 py-1 md:py-2 transition text-black text-sm md:text-base">
            ¥ {price}
          </p> */}

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
              })}
              defaultValue={price}
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              {...register("weight", {
                required: "Weight is required",
                min: { value: 0, message: "Weight must be positive" },
              })}
              defaultValue={weight}
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
            />
            {errors.weight && (
              <p className="text-red-500 text-sm">{errors.weight.message}</p>
            )}
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dimensions (LxWxH cm) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("dimensions", {
                required: "Dimensions are required",
              })}
              defaultValue={dimensions}
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
            />
            {errors.dimensions && (
              <p className="text-red-500 text-sm">
                {errors.dimensions.message}
              </p>
            )}
          </div>

          {/* Shipping Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Shipping Time (days) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("shippingTime", {
                required: "Shipping time required",
                min: { value: 1, message: "Minimum 1 day" },
              })}
              defaultValue={shippingTime}
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
            />
            {errors.shippingTime && (
              <p className="text-red-500 text-sm">
                {errors.shippingTime.message}
              </p>
            )}
          </div>

          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Store Name <span className="text-red-500">*</span>
            </label>
            <select
              defaultValue={storeName}
              {...register("storeName", { required: "Store name is required" })}
              className="w-full mt-1 p-2 border rounded outline-none bg-white dark:bg-black dark:border-shadow"
            >
              <option value="">Select a store</option>
              <option value="taobao">Taobao</option>
              <option value="weidian">Weidian</option>
              <option value="1688">1688</option>
            </select>
            {errors.storeName && (
              <p className="text-red-500 text-sm">{errors.storeName.message}</p>
            )}
          </div>

          {/* Product Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("productCode", {
                required: "Product code is required",
              })}
              defaultValue={productCode}
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
            />
            {errors.productCode && (
              <p className="text-red-500 text-sm">
                {errors.productCode.message}
              </p>
            )}
          </div>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-btn text-white py-2 rounded hover:bg-green-500 transition mt-6"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            "Update Product"
          )}
        </button>
      </div>
      <div
        onClick={() => setIsEditClicked(false)}
        className="absolute top-2 right-2 cursor-pointer"
      >
        <X className="text-red-500 rounded p-1 size-7" />
      </div>
    </form>
  );
};

export default ProductEdit;

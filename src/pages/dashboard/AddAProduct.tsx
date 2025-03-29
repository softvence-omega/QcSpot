// src/components/AddProduct.tsx
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxios";
import { ProductForm, ProductVariant, ProductImage } from "../../types";
import {
  handleImageChange,
  handleMultipleImagesChange,
  removeImage,
  removeProductImage,
  handleIncreaseInputField,
} from "../../components/ProductFormUtils";
import { AxiosError } from "axios";

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>();

  const [varient, setVarient] = useState<ProductVariant[]>([
    { key: "", value: "" },
  ]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [hoverImagePreview, setHoverImagePreview] = useState<string | null>(
    null
  );
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const mainImageRef = useRef<HTMLInputElement | null>(null);
  const hoverImageRef = useRef<HTMLInputElement | null>(null);
  const productImagesRef = useRef<HTMLInputElement | null>(null);

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e, setMainImagePreview, mainImageRef);
  };

  const handleHoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e, setHoverImagePreview, hoverImageRef);
  };

  const handleMultipleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMultipleImagesChange(
      e,
      productImages,
      setProductImages,
      productImagesRef
    );
  };

  const removeMainImage = () => {
    removeImage(setMainImagePreview, mainImageRef);
  };

  const removeHoverImage = () => {
    removeImage(setHoverImagePreview, hoverImageRef);
  };

  const removeProductImg = (index: number) => {
    removeProductImage(index, setProductImages);
  };

  const handleIncrease = () => {
    handleIncreaseInputField(varient, setVarient);
  };

  // ------------ Submit Handler -----------------
  const onSubmit = async (data: ProductForm) => {
    const formData = new FormData();

    // Append thumbnails
    const thumbnails: File[] = [];
    if (mainImageRef.current?.files?.[0])
      thumbnails.push(mainImageRef.current.files[0]);
    if (hoverImageRef.current?.files?.[0])
      thumbnails.push(hoverImageRef.current.files[0]);
    thumbnails.forEach((file) => formData.append("thumbnailImg", file));

    // Append product images
    productImages.forEach((image) => formData.append("photos", image.file));

    // Prepare variant data
    const variantData: Record<string, string> = {};
    varient.forEach((item) => {
      if (item.key && item.value) variantData[item.key] = item.value;
    });

    const productInfo = {
      product: {
        name: data.name,
        price: data.price,
        weight: data.weight,
        shippingTime: data.shippingTime,
        dimensions: data.dimensions,
        storeName: data.storeName,
        productCode: data.productCode,
      },
      variant: {
        ...variantData,
        quantity: data.quantity,
      },
    };

    formData.append("data", JSON.stringify(productInfo));

    try {
      setLoading(true);
      const res = await axiosSecure.post("/products/addProduct", formData);
      if (res.status !== 200) throw new Error("Network response was not ok");
      toast.success("Product added successfully!");
      resetForm();
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add product";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setMainImagePreview(null);
    setHoverImagePreview(null);
    setProductImages([]);
    setVarient([{ key: "", value: "" }]);
    if (mainImageRef.current) mainImageRef.current.value = "";
    if (hoverImageRef.current) hoverImageRef.current.value = "";
    if (productImagesRef.current) productImagesRef.current.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Add a Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", { required: "Product name is required" })}
              placeholder="e.g.: Shirt X200"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
              })}
              placeholder="e.g.: 500.99"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Main Image */}
          <div>
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
              required
            />
            <button
              type="button"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black"
              onClick={() => mainImageRef.current?.click()}
            >
              Add Product Thumbnail
            </button>
          </div>

          {/* Hover Image */}
          <div>
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
              required
            />
            <button
              type="button"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black"
              onClick={() => hoverImageRef.current?.click()}
            >
              Add Thumbnail hover
            </button>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register("weight", {
                required: "Weight is required",
                min: { value: 0, message: "Weight must be positive" },
              })}
              placeholder="e.g.: 0.3"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black"
            />
            {errors.weight && (
              <p className="text-red-500 text-sm">{errors.weight.message}</p>
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
              placeholder="e.g.: 7"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black"
            />
            {errors.shippingTime && (
              <p className="text-red-500 text-sm">
                {errors.shippingTime.message}
              </p>
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
              placeholder="e.g.: 4.5x4.5x1 cm"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black"
            />
            {errors.dimensions && (
              <p className="text-red-500 text-sm">
                {errors.dimensions.message}
              </p>
            )}
          </div>
        </div>

        {/* Store Info Section */}
        <h2 className="text-2xl font-semibold text-center pt-10 mb-4">
          Store Name and Product Code
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Store Name <span className="text-red-500">*</span>
            </label>
            <select
              {...register("storeName", { required: "Store name is required" })}
              className="w-full mt-1 p-2 border rounded outline-none bg-white dark:bg-black"
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
              placeholder="e.g.: 178963f"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black"
            />
            {errors.productCode && (
              <p className="text-red-500 text-sm">
                {errors.productCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Variant Section */}
        <h2 className="text-2xl font-semibold text-center pt-10 mb-4">
          Add a Product Variant
        </h2>
        <div className="w-full">
          {/* Quantity */}
          <div className="w-60 mx-auto mt-4 mb-10">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Minimum quantity is 1" },
              })}
              placeholder="e.g.: 20"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity.message}</p>
            )}
          </div>

          {/* Variant Key-Value Pairs */}
          <div className="flex flex-col gap-3">
            <label className="flex justify-center items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              Key Value pair <span className="text-red-500 ml-1">*</span>
            </label>
            {varient.map((singleClass, index) => (
              <div
                key={index}
                className="flex justify-center items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Key (e.g. color, size)"
                  className="w-40 sm:w-60 border p-2 rounded-md focus:outline-none focus:border-btn bg-white dark:bg-black"
                  value={singleClass.key}
                  onChange={(e) => {
                    const updatedClasses = [...varient];
                    updatedClasses[index].key = e.target.value;
                    setVarient(updatedClasses);
                  }}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. black, xl)"
                  className="w-40 sm:w-60 border p-2 rounded-md focus:outline-none focus:border-btn bg-white dark:bg-black"
                  value={singleClass.value}
                  onChange={(e) => {
                    const updatedClasses = [...varient];
                    updatedClasses[index].value = e.target.value;
                    setVarient(updatedClasses);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (varient.length > 1) {
                      setVarient(varient.filter((_, i) => i !== index));
                    }
                  }}
                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-red-500 text-white"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleIncrease}
                className="h-8 w-fit px-5 rounded-lg flex items-center justify-center bg-gray-100 duration-300 dark:text-black border"
              >
                Add More
              </button>
            </div>
          </div>

          {/* Additional Images */}
          <div className="mt-6">
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
                      onClick={() => removeProductImg(index)}
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
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

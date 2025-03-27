import { useState } from "react";
import { useForm } from "react-hook-form";

type ProductForm = {
  name: string;
  price: number;
  mainImage: FileList;
  hoverImage: FileList;
  productImages: FileList;
  weight: number;
  shippingTime: number;
  dimensions: string;
  storeName: string;
  productCode: string;
  quantity: number;
};

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>();
  const [classes, setClasses] = useState([{ key: "", value: "" }]);

  const handleIncreaseInputField = () => {
    setClasses([...classes, { key: "", value: "" }]);
  };

  const onSubmit = async (data: ProductForm) => {
    const formData = new FormData();

    // Append product details
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("weight", data.weight.toString());
    formData.append("shippingTime", data.shippingTime.toString());
    formData.append("dimensions", data.dimensions);
    formData.append("storeName", data.storeName);
    formData.append("productCode", data.productCode);
    formData.append("quantity", data.quantity.toString());

    // Append images
    if (data.mainImage && data.mainImage[0]) {
      formData.append("thumbnailImg", data.mainImage[0]);
    }
    if (data.hoverImage && data.hoverImage[0]) {
      formData.append("thumbnailImg", data.hoverImage[0]);
    }

    // Append additional product images (up to 10)
    if (data.productImages) {
      for (let i = 0; i < Math.min(data.productImages.length, 10); i++) {
        formData.append("photos", data.productImages[i]);
      }
    }

    // Append variant data
    const variantData: Record<string, string> = {
      belt: "synthetic",
      size: "xl",
      depth: "50m",
      color: "black",
      forHuman: "false",
      black: "yellow",
    };

    // Add dynamic variant fields from classes
    classes.forEach((item) => {
      if (item.key && item.value) {
        variantData[item.key] = item.value;
      }
    });

    formData.append("variant", JSON.stringify(variantData));

    try {
      const response = await fetch("your-backend-endpoint", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - the browser will set it automatically with the correct boundary
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
      alert("Product added successfully!");
      reset();
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting form");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-40 md:pt-24 pb-10 px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Add a Product</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        encType="multipart/form-data"
      >
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              {...register("name", { required: "Product name is required" })}
              placeholder="e.g.: Shirt X200"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price", { required: "Price is required", min: 0 })}
              placeholder="e.g.: 500.99"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Main Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Main Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("mainImage", { required: "Main image is required" })}
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500"
            />
            {errors.mainImage && (
              <p className="text-red-500 text-sm">{errors.mainImage.message}</p>
            )}
          </div>

          {/* Hover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hover Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("hoverImage", {
                required: "Hover image is required",
              })}
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500"
            />
            {errors.hoverImage && (
              <p className="text-red-500 text-sm">
                {errors.hoverImage.message}
              </p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("weight", {
                required: "Weight is required",
                min: 0,
              })}
              placeholder="e.g.: 0.3"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500"
            />
            {errors.weight && (
              <p className="text-red-500 text-sm">{errors.weight.message}</p>
            )}
          </div>

          {/* Shipping Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Shipping Time (days)
            </label>
            <input
              type="number"
              {...register("shippingTime", {
                required: "Shipping time required",
                min: 1,
              })}
              placeholder="e.g.: 7"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500"
            />
            {errors.shippingTime && (
              <p className="text-red-500 text-sm">
                {errors.shippingTime.message}
              </p>
            )}
          </div>
          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dimensions (LxWxH cm)
            </label>
            <input
              type="text"
              {...register("dimensions", {
                required: "Dimensions are required",
              })}
              placeholder="e.g.: 4.5x4.5x1 cm"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500"
            />
            {errors.dimensions && (
              <p className="text-red-500 text-sm">
                {errors.dimensions.message}
              </p>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center pt-10 mb-4">
          Store Name and Product Code
        </h2>
        {/* Store Name and Product Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Store Name
            </label>
            <input
              type="text"
              {...register("storeName", { required: "Store name is required" })}
              placeholder="e.g.: Taobao"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500"
            />
            {errors.storeName && (
              <p className="text-red-500 text-sm">{errors.storeName.message}</p>
            )}
          </div>

          {/* Product Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Code
            </label>
            <input
              type="text"
              {...register("productCode", {
                required: "Product code is required",
              })}
              placeholder="e.g.: 178963f"
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500"
            />
            {errors.productCode && (
              <p className="text-red-500 text-sm">
                {errors.productCode.message}
              </p>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center pt-10 mb-4">
          Add a Product Variant
        </h2>
        <div className="w-full">
          {/* Key Value pair */}
          <div className="flex flex-col gap-3">
            {classes.map((singleClass, index) => (
              <div
                key={index}
                className="flex justify-center items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Key (e.g. color, size)"
                  className="w-60 border text-black bg-white p-2 rounded-md focus:outline-none focus:border-btn"
                  value={singleClass.key}
                  onChange={(e) => {
                    const updatedClasses = [...classes];
                    updatedClasses[index].key = e.target.value;
                    setClasses(updatedClasses);
                  }}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. black, xl)"
                  className="w-60 border text-black bg-white p-2 rounded-md focus:outline-none focus:border-btn"
                  value={singleClass.value}
                  onChange={(e) => {
                    const updatedClasses = [...classes];
                    updatedClasses[index].value = e.target.value;
                    setClasses(updatedClasses);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (classes.length > 1) {
                      setClasses(classes.filter((_, i) => i !== index));
                    }
                  }}
                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-red-500 text-white"
                >
                  -
                </button>
              </div>
            ))}
            <div className="flex justify-center ">
              <button
                type="button"
                onClick={handleIncreaseInputField}
                className="h-8 w-fit px-5 rounded-lg flex items-center justify-center bg-btn hover:bg-green-500 duration-300 text-white"
              >
                Add More
              </button>
            </div>
          </div>
          {/* quantity */}
          <div className="w-60 mx-auto">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="text"
              {...register("quantity", { required: "Quantity is required" })}
              placeholder="e.g.: 20"
              className="mt-1 p-2 border rounded outline-none focus:border-green-500"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity.message}</p>
            )}
          </div>

          {/* Additional Product Images */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Additional Product Images (Max 10)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              {...register("productImages")}
              className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-btn text-white py-2 rounded hover:bg-green-500 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

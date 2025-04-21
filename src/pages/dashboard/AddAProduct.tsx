import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  extractFromUrl,
  handleAcBuyUrl,
  handleCssBuyUrl,
} from "../../components/handleQcSearch";
import Swal from "sweetalert2";
import axiosSecure from "../../hooks/useAxios";
import { Product } from "../ProductDetailsPage";

const AddAProduct = () => {
  const [input, setInput] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [shippingTime, setShippingTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Submit Handler
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!input) {
      toast.error("Please provide a url");
      setLoading(false);
      return;
    }

    const url = new URL(input);
    const searchedUrl = url.searchParams.get("url");
    const cssBuyUrl = url.href.includes("www.cssbuy.com");
    const acBuyUrl = url.href.includes("www.acbuy.com");
    let shopType: string | undefined;
    let id: string | undefined;
    shopType =
      url.searchParams.get("shoptype") ||
      url.searchParams.get("shop_type") ||
      url.searchParams.get("channel") ||
      url.searchParams.get("platform") ||
      (searchedUrl && extractFromUrl(searchedUrl).domain) ||
      ((cssBuyUrl && handleCssBuyUrl(url.href)?.shopType) as string) ||
      ((acBuyUrl &&
        handleAcBuyUrl(url.searchParams.get("source") as string)) as string);
    id =
      url.searchParams.get("id") ||
      url.searchParams.get("itemID") ||
      url.searchParams.get("goodsId") ||
      (searchedUrl && extractFromUrl(searchedUrl).itemID) ||
      ((cssBuyUrl && handleCssBuyUrl(url.href)?.itemId) as string);

    if (!shopType || !id) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid URL or missing parameters!",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://cnfans.com/search-api/detail/product-info?platform=${shopType}&productID=${id}&forceReload=false&site=cnfans&lang=en&wmc-currency=USD`
      );
      const data = await res.json();
      const productData: Product = data?.data?.productInfo || null;

      const product = {
        name: productData.title,
        price: productData.price,
        thumbnailImg: productData.skus[0].imgUrl,
        ...(weight !== "" && { weight: parseInt(weight) }),
        ...(shippingTime !== "" && { shippingTime: parseInt(shippingTime) }),
        ...(dimensions !== "" && { dimensions }),
        storeName: shopType,
        productCode: id,
      };
      const createProductResponse = await axiosSecure.post(
        "/products/addProduct",
        product
      );
      if (createProductResponse.status !== 200)
        toast.error("Network response was not ok");
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4">
        Add a Product
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product URL <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="paste url here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full mt-1 p-2 border rounded outline-none placeholder:text-sm focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Weight (g)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g.: 0.3"
              className="w-full mt-1 p-2 border rounded outline-none placeholder:text-sm focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
            />
          </div>

          {/* Shipping Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Shipping Time (days)
            </label>
            <input
              type="number"
              value={shippingTime}
              onChange={(e) => setShippingTime(e.target.value)}
              placeholder="e.g.: 7"
              className="w-full mt-1 p-2 border rounded outline-none placeholder:text-sm focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
            />
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dimensions (LxWxH cm)
            </label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g.: 4.5x4.5x1 [Don't write cm or any other unit]"
              className="w-full mt-1 p-2 border rounded outline-none placeholder:text-sm focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
            />
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

export default AddAProduct;

import { useForm } from "react-hook-form";
import { IAgent } from "../../types/agent.type";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/useAxios";
import { Loader2, X } from "lucide-react";
import {
  handleImageChange,
  removeImage,
} from "../../components/ProductFormUtils";

const AddAnAgent = () => {
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IAgent>();

  // Image change handlers
  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e, setImage, imageRef);
  };
  const removeMainImage = () => removeImage(setImage, imageRef);

  const onSubmit = async (data: IAgent) => {
    const agentInfo = {
      name: data.name,
      offer: data.offer,
      to: {
        taobao: data.to.taobao,
        weidian: data.to.weidian,
        ali_1688: data.to.ali_1688,
      },
    };
    const formData = new FormData();
    if (imageRef.current?.files?.[0])
      formData.append("image", imageRef.current.files[0]);
    else setImageError("Image is required");
    formData.append("data", JSON.stringify(agentInfo));

    try {
      setLoading(true);
      const res = await axiosSecure.post("/agent/createAgent", formData);
      if (res.status !== 200) throw new Error("Network response was not ok");
      toast.success("Agent added successfully!");
      reset();
      setImage(null);
      if (imageRef.current) imageRef.current.value = "";
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add agent";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4">
        Add an Agent
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/*  Name */}
        <div>
          <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name", {
              required: "Agent name is required",
            })}
            placeholder="e.g: Lovegobuy"
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        {/*  Taobao */}
        <div>
          <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            Taobao Link <span className="text-red-500">*</span>
          </label>
          <input
            {...register("to.taobao", {
              required: "Taobao Link is required",
            })}
            placeholder="use {id} in place of product code"
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
          />
          {errors.to?.taobao && (
            <p className="text-red-500 text-sm">{errors.to.taobao.message}</p>
          )}
        </div>
        {/*  Weidian */}
        <div>
          <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            Weidian Link <span className="text-red-500">*</span>
          </label>
          <input
            {...register("to.weidian", {
              required: "Weidian Link is required",
            })}
            placeholder="use {id} in place of product code"
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
          />
          {errors.to?.weidian && (
            <p className="text-red-500 text-sm">{errors.to.weidian.message}</p>
          )}
        </div>
        {/*  1688 */}
        <div>
          <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            1688 Link <span className="text-red-500">*</span>
          </label>
          <input
            {...register("to.ali_1688", {
              required: "1688 Link is required",
            })}
            placeholder="use {id} in place of product code"
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
          />
          {errors.to?.ali_1688 && (
            <p className="text-red-500 text-sm">{errors.to.ali_1688.message}</p>
          )}
        </div>
        {/*  Offer */}
        <div>
          <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            Offer <span className="text-red-500">*</span>
          </label>
          <input
            {...register("offer", {
              required: "Offer is required",
            })}
            placeholder="e.g: $156 coupons for new users"
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
          />
          {errors.offer && (
            <p className="text-red-500 text-sm">{errors.offer.message}</p>
          )}
        </div>
        {/* Image */}
        <div className="col-span-2">
          <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            Image
          </label>
          {image && (
            <div className="mb-2 relative inline-block">
              <img
                src={image}
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
            ref={imageRef}
            onChange={handleMainImage}
            className="hidden"
            required
          />
          <button
            type="button"
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
            onClick={() => imageRef.current?.click()}
          >
            Add agent image
          </button>
          {imageError !== "" && (
            <p className="text-red-500 text-sm">{imageError}</p>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 w-full bg-btn text-white py-2 rounded hover:bg-green-500 transition"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            "Add Agent"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddAnAgent;

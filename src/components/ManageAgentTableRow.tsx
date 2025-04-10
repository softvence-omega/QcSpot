import { useRef, useState } from "react";
import useAgent from "../hooks/useAgent";
import { IAgent } from "../types/agent.type";
import { Loader2, X } from "lucide-react";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import axiosSecure from "../hooks/useAxios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { handleImageChange, removeImage } from "./ProductFormUtils";
import Swal from "sweetalert2";

interface IAgentData {
  agent: IAgent;
  refetch: () => void;
}

const ManageAgentTableRow = ({ agent, refetch }: IAgentData) => {
  const { agentData } = useAgent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Agent serial number change
  const handleAgentSerial = (sl: number) => {
    axiosSecure
      .patch(`/agent/serial?agentId=${agent._id}`, { sl })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`${agent.name} serial updated successfully!`);
          refetch();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to update agent serial"
        );
      });
  };

  // Agent state change
  const handleAgentState = () => {
    axiosSecure
      .patch(`/agent/state?agentId=${agent._id}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success(`${agent.name} state updated successfully!`);
          refetch();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to update agent state"
        );
      });
  };

  // Agent delete
  const handleAgentDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/agent/remove?agentId=${agent._id}`)
          .then((res) => {
            if (res.status === 200) {
              refetch();
              Swal.fire("Deleted!", "Agent has been deleted.", "success");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  // Agent update
  const handleAgentUpdate = async (data: IAgent) => {
    const agentInfo = {
      name: data.name,
      offer: data.offer,
      to: {
        taobao: data.to.taobao,
        weidian: data.to.weidian,
        ali_1688: data.to.ali_1688,
      },
    };
    console.log(agentInfo);
    const formData = new FormData();
    if (imageRef.current?.files?.[0])
      formData.append("image", imageRef.current.files[0]);
    formData.append("data", JSON.stringify(agentInfo));

    // try {
    //   setLoading(true);
    //   const res = await axiosSecure.post("/agent/update", formData);
    //   if (res.status !== 200) throw new Error("Network response was not ok");
    //   toast.success("Agent updated successfully!");
    //   reset();
    //   refetch();
    //   setImage(null);
    //   if (imageRef.current) imageRef.current.value = "";
    // } catch (error: any) {
    //   console.error("Error:", error);
    //   const errorMessage =
    //     error.response?.data?.message || "Failed to update agent details";
    //   toast.error(errorMessage);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <tr className="text-sm sm:text-base bg-white dark:bg-black border-b dark:border-zinc-700 h-12">
      <th>
        <select className="bg-white dark:bg-black">
          <option disabled selected value={agent.sl}>
            {agent.sl}
          </option>
          {agentData
            ?.filter((a: IAgent) => a.sl !== agent.sl)
            ?.map((a: IAgent) => (
              <option
                onClick={() => handleAgentSerial(a.sl)}
                key={a._id}
                value={a.sl}
              >
                {a.sl}
              </option>
            ))}
        </select>
      </th>
      <td>
        <img
          className="w-10 h-10 rounded mx-auto"
          src={agent?.img}
          alt={agent?.name}
        />
      </td>
      <td>{agent.name}</td>
      <td>
        <select className="bg-white dark:bg-black">
          <option disabled selected>
            {agent.active ? "active" : "inactive"}
          </option>
          <option onClick={() => handleAgentState()}>
            {!agent.active ? "active" : "inactive"}
          </option>
        </select>
      </td>
      <td className="">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs sm:px-2 py-1 rounded cursor-pointer duration-300"
        >
          <FaEdit className="text-lg text-green-500" />
        </button>
        <button
          onClick={() => handleAgentDelete()}
          className="text-xs sm:px-2 py-1 rounded cursor-pointer duration-300"
        >
          <FaRegTrashAlt className="text-lg text-red-500" />
        </button>
      </td>

      {/* AGENT Update Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Update Agent Details
            </h2>
            <form
              onSubmit={handleSubmit(handleAgentUpdate)}
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
                  defaultValue={agent.name}
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
                  defaultValue={agent.to.taobao}
                  className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
                />
                {errors.to?.taobao && (
                  <p className="text-red-500 text-sm">
                    {errors.to.taobao.message}
                  </p>
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
                  defaultValue={agent.to.weidian}
                  className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
                />
                {errors.to?.weidian && (
                  <p className="text-red-500 text-sm">
                    {errors.to.weidian.message}
                  </p>
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
                  defaultValue={agent.to.ali_1688}
                  className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
                />
                {errors.to?.ali_1688 && (
                  <p className="text-red-500 text-sm">
                    {errors.to.ali_1688.message}
                  </p>
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
                  defaultValue={agent.offer}
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
                />
                <button
                  type="button"
                  className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
                  onClick={() => imageRef.current?.click()}
                >
                  Change agent image
                </button>
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
                  "Update Details"
                )}
              </button>
            </form>
            <button
              className="text-red-500 absolute top-2 right-2 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </tr>
  );
};

export default ManageAgentTableRow;

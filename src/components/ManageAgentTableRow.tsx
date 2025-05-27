import { ChangeEvent, useEffect, useRef, useState } from "react";
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
  index: number;
}

const ManageAgentTableRow = ({ agent, refetch, index }: IAgentData) => {
  console.log(agent);
  const { agentData } = useAgent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [isActive, setIsActive] = useState(agent?.active);
  const [isSelected, setIsSelected] = useState(agent?.isSelected);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IAgent>();

  useEffect(() => {
    setIsSelected(agent?.isSelected);
  }, [agent?.isSelected]);

  const serials = Array.from(
    { length: agentData?.length || 0 },
    (_, i) => i + 1
  );

  // Image change handlers
  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e, setImage, imageRef);
  };
  const removeMainImage = () => removeImage(setImage, imageRef);

  // Agent serial number change
  const handleAgentSerial = (sl: number) => {
    axiosSecure
      .patch(`/agent/setAgentSerial?agent_id=${agent._id}&serial_No=${sl}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success(`${agent.name} serial updated successfully!`);
          refetch();
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to update agent serial"
        );
      });
  };

  // Agent state change
  const handleAgentState = () => {
    axiosSecure
      .patch(
        `/agent/activeOrDactiveAnAgent?agent_id=${
          agent._id
        }&active=${!isActive}`
      )
      .then((res) => {
        if (res.status === 200) {
          setIsActive(!isActive);
          refetch();
          toast.success(
            `${agent.name} state updated to ${
              !isActive ? "Active" : "Inactive"
            }!`
          );
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to update agent state"
        );
      });
  };

  // Agent selection change
  const handleAgentSelected = () => {
    axiosSecure
      .patch(
        `/agent/selectAgent?agent_id=${agent._id}&isSelected=${!isSelected}`
      )
      .then((res) => {
        if (res.status === 200) {
          setIsSelected(!isSelected);
          refetch();
          toast.success(
            `${agent.name} updated to ${
              !isSelected ? "selected" : "Not selected"
            }!`
          );
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to update agent selection"
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
          .delete(`/agent/deleteAgent?agent_id=${agent._id}`)
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
    const formData = new FormData();
    if (imageRef.current?.files?.[0])
      formData.append("file", imageRef.current.files[0]);
    formData.append("data", JSON.stringify(agentInfo));

    try {
      setLoading(true);
      const res = await axiosSecure.post(
        `/agent/updateAgent?agent_id=${agent._id}`,
        formData
      );
      if (res.status !== 200) toast.error("Network response was not ok");
      toast.success("Agent updated successfully!");
      reset();
      refetch();
      setImage(null);
      setIsModalOpen(false);
      if (imageRef.current) imageRef.current.value = "";
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update agent details";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="text-xs sm:text-base bg-white dark:bg-black border-b dark:border-zinc-700 h-12">
      <th>
        <select
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleAgentSerial(parseInt(e.target.value))
          }
          className="bg-white dark:bg-black"
        >
          <option selected value={index + 1}>
            {index + 1}
          </option>
          {serials
            ?.filter((a: number) => a !== index + 1)
            ?.map((a: number) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
        </select>
      </th>
      <td>
        <img
          className="w-8 sm:w-10 h-8 sm:h-10 rounded mx-auto"
          src={agent?.img}
          alt={agent?.name}
        />
      </td>
      <td>{agent.name}</td>
      <td>
        <select
          value={isActive ? "active" : "inactive"}
          onChange={() => handleAgentState()}
          className={`text-xs text-white sm:text-sm rounded-lg px-1 max-w-20 cursor-pointer ${
            isActive ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
      </td>
      <td>
        <select
          value={isSelected ? "selected" : "not selected"}
          onChange={() => handleAgentSelected()}
          className={`text-xs text-white sm:text-sm rounded-lg px-1 max-w-20 cursor-pointer ${
            isSelected ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <option value="selected">selected</option>
          <option value="not selected">not selected</option>
        </select>
      </td>
      <td className="space-x-1 sm:space-x-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs py-1 rounded cursor-pointer duration-300"
        >
          <FaEdit className="sm:text-lg text-green-500" />
        </button>
        <button
          onClick={() => handleAgentDelete()}
          className="text-xs py-1 rounded cursor-pointer duration-300"
        >
          <FaRegTrashAlt className="sm:text-lg text-red-500" />
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

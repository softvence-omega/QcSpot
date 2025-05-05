import { IProduct } from "../pages/dashboard/ManageProducts";
import axiosSecure from "../hooks/useAxios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { ChangeEvent, FormEvent, useState } from "react";
import useProduct from "../hooks/useProducts";
import { Loader2, X } from "lucide-react";

interface ManageProductCardProps {
  product: IProduct;
  index: number;
  refetch: () => void;
}

const ManageProductTableRow: React.FC<ManageProductCardProps> = ({
  product,
  index,
  refetch,
}) => {
  const { _id, price, onTrend, thumbnailImg, storeName, productCode } = product;
  const { productData } = useProduct();
  const [isTrending, setIsTrending] = useState(onTrend);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState(product.weight || "");
  const [dimensions, setDimensions] = useState(product.dimensions || "");
  const [name, setName] = useState(product.name || "");
  const [shippingTime, setShippingTime] = useState(product.shippingTime || "");
  const serials = Array.from(
    { length: productData?.length || 0 },
    (_, i) => i + 1
  );

  // Product serial number change
  const handleProductSerial = (sl: number) => {
    axiosSecure
      .patch(`/products/setProductSerial?product_id=${_id}&serial_No=${sl}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success(`Serial updated successfully!`);
          refetch();
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to update agent serial"
        );
      });
  };

  const toggleTrending = () => {
    axiosSecure
      .patch(
        `/products/setOrRemoveProductOnTend?product_id=${_id}&status=${!onTrend}`
      )
      .then((res) => {
        if (res.status === 200) {
          refetch();
          toast.success("Trending list updated!");
          setIsTrending(!isTrending);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteProduct = () => {
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
          .delete(`/products/dleteProduct?product_id=${_id}`)
          .then((res) => {
            if (res.status === 200) {
              refetch();
              Swal.fire("Deleted!", "Product has been deleted.", "success");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const product = {
        ...(weight !== "" && { weight: parseInt(weight as string) }),
        ...(shippingTime !== "" && {
          shippingTime: parseInt(shippingTime as string),
        }),
        ...(dimensions !== "" && { dimensions }),
        ...(name !== "" && { name }),
      };

      const updateProductResponse = await axiosSecure.patch(
        `/products/updateProduct?product_id=${_id}`,
        product
      );
      if (updateProductResponse.status !== 200)
        toast.error("Network response was not ok");
      setIsModalOpen(false);
      refetch();
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("This Error happened:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="text-xs sm:text-base bg-white dark:bg-black border-b dark:border-zinc-700 h-12">
      <th>
        <select
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleProductSerial(parseInt(e.target.value))
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
          className="w-8 sm:w-10 h-8 sm:h-10 object-cover object-center rounded mx-auto"
          src={thumbnailImg}
          alt={name}
        />
      </td>
      <td>
        <Link
          className="cursor-pointer hover:underline hover:text-green-500 duration-300 line-clamp-1 sm:line-clamp-none"
          to={`/product/${
            storeName == "1688" ? "ali_1688" : storeName
          }/${productCode}`}
        >
          {product.name.length > 30
            ? product.name.slice(0, 30) + " ..."
            : product.name}
        </Link>
      </td>
      <td>{price}</td>
      <td>
        <select
          value={isTrending ? "trending" : "not trending"}
          onChange={toggleTrending}
          className={`text-xs sm:text-sm text-white rounded-lg px-1 max-w-20 sm:max-w-none cursor-pointer ${
            isTrending ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <option value="trending">Trending</option>
          <option value="not trending">Not Trending</option>
        </select>
      </td>
      <td className="flex gap-2 justify-center items-center mt-3 sm:mt-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs sm:px-2 py-1 rounded cursor-pointer duration-300"
        >
          <FaEdit className="sm:text-lg text-green-500" />
        </button>
        <button
          onClick={() => deleteProduct()}
          className="text-xs sm:px-2 py-1 rounded cursor-pointer duration-300"
        >
          <FaRegTrashAlt className="sm:text-lg text-red-500" />
        </button>
      </td>
      {/* Product Update Modal */}
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
              Update Product Details
            </h2>
            <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="col-span-2">
                <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g.: 4.5x4.5x1 [Don't write cm or any other unit]"
                  className="w-full mt-1 p-2 border rounded outline-none placeholder:text-sm focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
                />
              </div>
              {/* Weight */}
              <div>
                <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Weight (g)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g.: 5"
                  className="w-full mt-1 p-2 border rounded outline-none placeholder:text-sm focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
                />
              </div>

              {/* Shipping Time */}
              <div>
                <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <div className="col-span-2">
                <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
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

export default ManageProductTableRow;

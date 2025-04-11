import { IProduct } from "../pages/dashboard/ManageProducts";
import axiosSecure from "../hooks/useAxios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiShareBoxLine } from "react-icons/ri";
import { ChangeEvent, useState } from "react";
import useProduct from "../hooks/useProducts";

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
  const { _id, name, price, onTrend, thumbnailImg } = product;
  const { productData } = useProduct();
  const [isTrending, setIsTrending] = useState(onTrend);
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
        console.log(error);
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

  return (
    <tr className="text-sm sm:text-base bg-white dark:bg-black border-b dark:border-zinc-700 h-12">
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
          className="w-10 h-10 object-cover object-center rounded mx-auto"
          src={thumbnailImg[0]}
          alt={name}
        />
      </td>
      <td>
        <Link
          className="cursor-pointer hover:underline hover:text-green-500 duration-300"
          to={`/dashboard/manage-products/${_id}`}
        >
          {name.length > 30 ? name.slice(0, 30) + " ..." : name}
        </Link>
      </td>
      <td>{price}</td>
      <td>
        <select
          onChange={toggleTrending}
          className={`text-sm rounded-lg px-1 ${
            isTrending ? "bg-green-300" : "bg-red-300"
          }`}
        >
          <option selected disabled>
            {isTrending ? "Trending" : "Not Trending"}
          </option>
          <option>{!isTrending ? "Trending" : "Not Trending"}</option>
        </select>
      </td>
      <td className="flex gap-2 justify-center items-center mt-2">
        <Link
          to={`/dashboard/manage-products/${_id}`}
          className="text-xs sm:px-2 py-1 rounded cursor-pointer duration-300"
        >
          <RiShareBoxLine className="text-lg text-green-500" />
        </Link>
        <button
          onClick={() => deleteProduct()}
          className="text-xs sm:px-2 py-1 rounded cursor-pointer duration-300"
        >
          <FaRegTrashAlt className="text-lg text-red-500" />
        </button>
      </td>
    </tr>
  );
};

export default ManageProductTableRow;

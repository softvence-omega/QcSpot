import { Camera, Eye } from "lucide-react";
import { IProduct } from "../pages/dashboard/ManageProducts";
import axiosSecure from "../hooks/useAxios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface ManageProductCardProps {
  product: IProduct;
  refetch: () => void;
}

const ManageProductCard: React.FC<ManageProductCardProps> = ({
  product,
  refetch,
}) => {
  const { _id, name, price, onTrend, totalView, totalPhoto, thumbnailImg } =
    product;

  const toggleTrending = () => {
    axiosSecure
      .patch(
        `/products/setOrRemoveProductOnTend?product_id=${_id}&status=${!onTrend}`
      )
      .then((res) => {
        if (res.status === 200) {
          refetch();
          toast.success("Trending list updated!");
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
    <div className="relative w-[300px] rounded-lg shadow-md dark:shadow-shadow">
      <p className="absolute top-3 right-3">
        {onTrend ? (
          <button
            onClick={toggleTrending}
            className="bg-green-200 dark:bg-btn rounded text-xs py-1 px-2 cursor-pointer"
          >
            Trending
          </button>
        ) : (
          <button
            onClick={toggleTrending}
            className="bg-yellow-200 dark:text-black rounded text-xs py-1 px-2 cursor-pointer"
          >
            Mark as Trending
          </button>
        )}
      </p>
      <img
        className="w-full h-[300px] object-cover object-center rounded-t-lg"
        src={thumbnailImg[0]}
        alt={name}
      />
      <div className="p-4">
        <h5 className="line-clamp-2 text-lg font-semibold mb-5">{name}</h5>

        <div className="flex justify-between items-center gap-3 mb-5">
          <div className="flex gap-2 items-center">¥ {price}</div>
          <div className="flex gap-2 items-center">
            <Camera size={16} />
            <span>{totalPhoto}</span>
          </div>
          <div className="flex gap-2 items-center">
            <Eye size={16} />
            <span>{totalView}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/manage-products/${_id}`}
            className="bg-gray-200 text-zinc-600 rounded-lg py-1 w-full flex justify-center"
          >
            View QC
          </Link>
          <button
            onClick={deleteProduct}
            className="bg-red-500 hover:bg-red-400 text-white duration-200 rounded-lg py-1 w-full"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProductCard;

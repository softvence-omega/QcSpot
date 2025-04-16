import axiosSecure from "../hooks/useAxios";
import { useState, ChangeEvent, SetStateAction } from "react";
import { IReview } from "../types/review.type";
import toast from "react-hot-toast";
import { X } from "lucide-react";

interface ManageReviewCardProps {
  review: IReview;
  index: number;
  refetch: () => void;
}

const ManageReviewTableRow: React.FC<ManageReviewCardProps> = ({
  review,
  index,
  refetch,
}) => {
  const { _id, name, comment, rating, status } = review;
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatus = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value as SetStateAction<
      "pending" | "denied" | "approved"
    >;
    try {
      const res = await axiosSecure.patch(`/reviews/status/${_id}`, {
        status: selectedStatus,
      });
      if (res.data.modifiedCount > 0) {
        setCurrentStatus(selectedStatus);
        toast.success(`Review status changed to "${selectedStatus}"`);
        refetch();
      } else {
        toast.error("Could not make any change!");
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <tr className="text-xs sm:text-base bg-white dark:bg-black border-b dark:border-zinc-700 h-12">
      <th>{index + 1}</th>
      <td>{name}</td>
      <td
        onClick={() => setIsOpen(true)}
        className="max-w-20 sm:max-w-60 sm:min-w-32 cursor-pointer hover:underline"
      >
        {comment.length > 50 ? comment.slice(0, 50) + " ..." : name}
      </td>
      <td>{rating}</td>
      <td>
        <select
          value={currentStatus}
          onChange={handleStatus}
          className={`text-xs sm:text-sm text-white rounded-lg px-1 max-w-20 sm:max-w-none cursor-pointer outine-none ${
            currentStatus === "approved"
              ? "bg-green-500"
              : currentStatus === "denied"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      </td>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="">{comment}</p>
            <button
              className="text-red-500 absolute top-2 right-2 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </tr>
  );
};

export default ManageReviewTableRow;

import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import axiosSecure from "../hooks/useAxios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { IUser } from "../types/user.type";

interface IuserData {
  user: IUser;
  refetch: () => void;
  index: number;
}

const UsersTableRow = ({ user, refetch, index }: IuserData) => {
  const [isVerified, setIsVerified] = useState<boolean>(user?.isVerified);
  const [isUser, setIsUser] = useState<boolean>(
    user?.role == "user" ? true : false
  );

  const handleUserVerification = () => {
    axiosSecure
      .patch(
        `/user/activeOrDactiveAnuser?user_id=${
          user._id
        }&verified=${!isVerified}`
      )
      .then((res) => {
        if (res.status === 200) {
          refetch();
          toast.success(
            `${user.name} state updated to ${
              !isVerified ? "Active" : "Inactive"
            }!`
          );
          setIsVerified(!isVerified);
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to update user state"
        );
      });
  };

  const handleUserRole = () => {
    axiosSecure
      .patch(`/user/activeOrDactiveAnuser?user_id=${user._id}`, {
        role: !isUser ? "user" : "admin",
      })
      .then((res) => {
        if (res.status === 200) {
          refetch();
          toast.success(
            `${user.name} role updated to ${!isUser ? "User" : "Admin"}!`
          );
          setIsUser(!user);
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to update user state"
        );
      });
  };

  const handleUserDelete = () => {
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
          .delete(`/user/deleteuser?user_id=${user._id}`)
          .then((res) => {
            if (res.status === 200) {
              refetch();
              Swal.fire("Deleted!", "user has been deleted.", "success");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <tr className="text-xs sm:text-base bg-white dark:bg-black border-b dark:border-zinc-700 h-12">
      <th className="">{index + 1}</th>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <select
          value={isVerified ? "verified" : "not verified"}
          onChange={() => handleUserVerification()}
          className={`text-xs text-white sm:text-sm rounded-lg px-1 max-w-20 cursor-pointer ${
            isVerified ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <option value="verified">Verified</option>
          <option value="not verified">Not verified</option>
        </select>
      </td>
      <td>
        <select
          value={isUser ? "user" : "admin"}
          onChange={() => handleUserRole()}
          className={`text-xs text-white sm:text-sm rounded-lg px-1 max-w-20 cursor-pointer ${
            isUser ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <td>
        <button
          onClick={() => handleUserDelete()}
          className="text-xs py-1 rounded cursor-pointer duration-300"
        >
          <FaRegTrashAlt className="sm:text-lg text-red-500" />
        </button>
      </td>
    </tr>
  );
};

export default UsersTableRow;

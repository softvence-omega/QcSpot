import { useState } from "react";
import axiosSecure from "../hooks/useAxios";
import toast from "react-hot-toast";
import { IUser } from "../types/user.type";

interface IuserData {
  user: IUser;
  refetch: () => void;
  index: number;
}

const UsersTableRow = ({ user, refetch, index }: IuserData) => {
  const [isUser, setIsUser] = useState<boolean>(
    user?.role == "user" ? true : false
  );

  const handleUserRole = () => {
    axiosSecure
      .post(
        `/users/changeUserRoleOrStatus?email=${user.email}&role=${
          !isUser ? "user" : "admin"
        }`
      )
      .then((res) => {
        if (res.status === 200) {
          refetch();
          toast.success(
            `${user.name} role updated to ${!isUser ? "User" : "Admin"}!`
          );
          setIsUser((prev) => !prev);
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to update user state"
        );
      });
  };

  return (
    <tr className="text-xs sm:text-base bg-white dark:bg-black border-b dark:border-zinc-700 h-12">
      <th className="">{index + 1}</th>
      <td>{user.name}</td>
      <td>{user.email}</td>
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
    </tr>
  );
};

export default UsersTableRow;

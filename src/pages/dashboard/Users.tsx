import { useState } from "react";
import UsersTableRow from "../../components/UsersTableRow";
import useUsers from "../../hooks/useUsers";
import Pagination from "../../components/Pagination";
import { Loader2, User } from "lucide-react";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const { usersData, usersLoading, usersRefetch } = useUsers({
    page: currentPage,
    email: email || undefined,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    usersRefetch();
  };

  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        All users in qcspot
      </h2>
      <div className="flex justify-between gap-5 sm:text-lg my-4">
        <p className="flex gap-2 items-center">
          <User />
          <span className="text-red-500 sm:text-xl font-semibold">
            {usersData.total}
          </span>
        </p>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Search by mail"
          className="max-w-60 sm:max-w-xs w-full px-3 py-1 rounded-lg border border-gray-300 placeholder:text-base dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-btn text-sm focus:border-transparent bg-white dark:bg-black dark:text-white transition-colors"
        />
        <p>Page: {usersData.page}</p>
      </div>

      <div className="overflow-x-auto">
        {usersLoading ? (
          <div className="flex justify-center items-center py-20 text-4xl">
            <Loader2 className="w-16 h-16 animate-spin" />
          </div>
        ) : usersData.users.length > 0 ? (
          <table className="text-center text-black dark:text-white w-full">
            <thead>
              <tr className="bg-zinc-200 dark:bg-zinc-700 border-b dark:border-shadow h-12">
                <th>Sl</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {usersData?.users?.map((user: any, index: number) => (
                <UsersTableRow
                  key={index + user.id}
                  user={user}
                  index={index + (currentPage - 1) * 100}
                  refetch={usersRefetch}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div>
            <p className="text-center">No Users Found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!usersLoading && (
        <Pagination
          currentPage={usersData.page}
          totalPages={usersData.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Users;

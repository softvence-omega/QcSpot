import Loader from "../../components/Loader";
import UsersTableRow from "../../components/UsersTableRow";
import useUsers from "../../hooks/useUsers";

const Users = () => {
  const { usersData, usersLoading, usersRefetch } = useUsers();
  if (usersLoading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        All users in qcspot
      </h2>
      <div className="flex justify-between gap-5 text-xl my-4">
        <p>Total Users: {usersData.total}</p>
        <p>Page: {usersData.page}</p>
      </div>
      <div className="overflow-x-auto">
        <table className=" text-center text-black dark:text-white w-full">
          {/* head */}
          <thead>
            <tr className="bg-zinc-200 dark:bg-zinc-700 border-b dark:border-shadow h-12">
              <th>Sl</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {usersData?.users?.map((user: any, index: number) => (
              <UsersTableRow user={user} index={index} refetch={usersRefetch} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;

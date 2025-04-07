import Loader from "../../components/Loader";
import useUsers from "../../hooks/useUsers";

const Users = () => {
  const { usersData, usersLoading } = useUsers();
  if (usersLoading) return <Loader />;

  console.log(usersData);
  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        All users in qcspot
      </h2>

      <div className="overflow-x-auto">
        <table className="table text-center text-black dark:text-white w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Sl</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {usersData?.map((user: any, index: number) => (
              <tr key={user._id}>
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;

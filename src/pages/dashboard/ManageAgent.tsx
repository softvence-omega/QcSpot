import Loader from "../../components/Loader";
import ManageAgentTableRow from "../../components/ManageAgentTableRow";
import useAgent from "../../hooks/useAgent";
import { IAgent } from "../../types/agent.type";

const ManageAgent = () => {
  const { agentData, agentLoading, agentRefetch } = useAgent();
  if (agentLoading) return <Loader />;

  return (
    <div className="max-w-5xl mx-8 lg:mx-auto py-20 md:pt-24 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Manage Agent</h2>

      <div className="overflow-x-auto">
        <table className="text-center text-black dark:text-white w-full">
          {/* head */}
          <thead>
            <tr className="bg-zinc-200 dark:bg-zinc-700 border-b dark:border-shadow h-12">
              <th>Sl</th>
              <th>Image</th>
              <th>Name</th>
              <th>State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {agentData?.map((agent: IAgent) => (
              <ManageAgentTableRow
                key={agent?._id}
                agent={agent}
                refetch={agentRefetch}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAgent;

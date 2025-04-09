import Loader from "../../components/Loader";
import ManageAgentTableRow from "../../components/ManageAgentTableRow";
import useAgent from "../../hooks/useAgent";
import { IAgent } from "../../types/agent.type";

const ManageAgent = () => {
  const { agentData, agentLoading, agentRefetch } = useAgent();
  if (agentLoading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Manage Agent</h2>

      <div className="overflow-x-auto">
        <table className="table text-center text-black dark:text-white w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Sl</th>
              <th>Image</th>
              <th>Name</th>
              <th>State</th>
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

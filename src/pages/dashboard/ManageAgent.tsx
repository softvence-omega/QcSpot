import { Loader2 } from "lucide-react";
import ManageAgentTableRow from "../../components/ManageAgentTableRow";
import useAgent from "../../hooks/useAgent";
import { IAgent } from "../../types/agent.type";

const ManageAgent = () => {
  const { agentData, agentLoading, agentRefetch } = useAgent();

  return (
    <div className="max-w-5xl mx-8 lg:mx-auto py-20 md:pt-24 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Manage Agent</h2>

      {agentLoading ? (
        <div className="flex justify-center items-center py-20 text-4xl">
          <Loader2 className="w-16 h-16 animate-spin" />
        </div>
      ) : (
        <div className="overflow-x6-auto">
          {agentData.length > 0 ? (
            <table className="text-center text-black dark:text-white w-full">
              {/* head */}
              <thead>
                <tr className="text-sm sm:text-base bg-zinc-200 dark:bg-zinc-700 border-b dark:border-shadow h-12">
                  <th>Sl</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {agentData?.map((agent: IAgent, index: number) => (
                  <ManageAgentTableRow
                    key={agent?._id}
                    agent={agent}
                    index={index}
                    refetch={agentRefetch}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <p className="text-center">No Agent Found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageAgent;

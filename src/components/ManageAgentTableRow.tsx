import useAgent from "../hooks/useAgent";
import { IAgent } from "../types/agent.type";
interface IAgentData {
  agent: IAgent;
  refetch: () => void;
}

const ManageAgentTableRow = ({ agent, refetch }: IAgentData) => {
  const { agentData } = useAgent();
  const handleAgentSerial = (sl: number) => {
    console.log(sl, agent?._id);
    refetch();
  };

  const handleAgentState = () => {
    console.log(agent?.active, agent?._id);
    refetch();
  };
  return (
    <tr>
      <th>
        <select className="bg-white">
          <option disabled value={agent.sl}>
            {agent.sl}
          </option>
          {agentData
            ?.filter((a: IAgent) => a.sl !== agent.sl)
            ?.map((a: IAgent) => (
              <option
                onClick={() => handleAgentSerial(a.sl)}
                key={a._id}
                value={a.sl}
              >
                {a.sl}
              </option>
            ))}
        </select>
      </th>
      <td>
        <img
          className="w-10 h-10 rounded mx-auto"
          src={agent?.img}
          alt={agent?.name}
        />
      </td>
      <td>{agent.name}</td>
      <td>
        <select className="bg-white">
          <option disabled> {agent.active ? "active" : "inactive"}</option>
          <option onClick={() => handleAgentState()}>
            {!agent.active ? "active" : "inactive"}
          </option>
        </select>
      </td>
    </tr>
  );
};

export default ManageAgentTableRow;

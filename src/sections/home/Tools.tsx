import { useState } from "react";
import {
  Search,
  Users,
  Clock,
  Scale,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { handleQcSearch } from "../../components/handleQcSearch";
import { useNavigate } from "react-router-dom";

const Tools = () => {
  const [qcSearchInput, setQcSearchInput] = useState("");
  const navigate = useNavigate();

  return (
    <div className="px-4 pb-20 pt-5">
      <h1 className="text-center w-fit mx-auto duration-300 text-2xl font-bold my-6">
        Tools
      </h1>
      <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {/* QC Lookup Card */}
        <div className="flex-1 min-w-[300px] rounded-xl p-6 shadow-lg border dark:border-shadow">
          <h2 className="text-lg font-semibold">QC Lookup</h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter a product link to verify its quality
          </p>

          <div className="flex justify-between mt-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-green-500 mb-1">
                <Search size={20} />
              </div>
              <span className="text-xs text-gray-500 max-w-[80px]">
                Real customer photos
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 mb-1">
                <Users size={20} />
              </div>
              <span className="text-xs text-gray-500 max-w-[80px]">
                Avoid Bait & Switch sellers
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-yellow-500 mb-1">
                <Clock size={20} />
              </div>
              <span className="text-xs text-gray-500 max-w-[80px]">
                Updated daily
              </span>
            </div>
          </div>

          <div className="mt-6 relative">
            <input
              type="text"
              value={qcSearchInput}
              onChange={(e) => setQcSearchInput(e.target.value)}
              placeholder="Enter product URL for QC search"
              className="w-full px-3 py-2 dark:bg-black border border- dark:border-shadow focus:outline-none focus:ring-1 focus:ring-btn focus:border-transparent rounded-lg text-sm"
            />
            <button
              onClick={() => handleQcSearch(qcSearchInput, navigate)}
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-green-600 bg-btn text-white p-1.5 rounded-lg transition-colors duration-200 "
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Shipping Calculator Card */}
        <div className="flex-1 min-w-[300px] rounded-xl p-6 shadow-lg border dark:border-shadow">
          <h2 className="text-lg font-semibold">Shipping Calculator</h2>
          <p className="text-gray-500 text-sm mt-2">
            Find the cheapest shipping based on your country
          </p>

          <div className="flex justify-around mt-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 mb-1">
                <Clock size={20} />
              </div>
              <span className="text-xs text-gray-500 max-w-[80px]">
                Delivery estimates
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-green-500 mb-1">
                <Scale size={20} />
              </div>
              <span className="text-xs text-gray-500 max-w-[80px]">
                Compare Agents
              </span>
            </div>
          </div>

          <button className="w-full mt-6 hover:bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 bg-btn transition-colors duration-200 ">
            <MessageSquare size={20} />
            Calculate Shipping
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tools;

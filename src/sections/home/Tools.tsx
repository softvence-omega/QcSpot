import { useState } from "react";
import {
  Search,
  Users,
  Gift,
  Clock,
  Scale,
  Link2,
  ExternalLink,
  Chrome,
  MessageSquare,
} from "lucide-react";
import { handleQcSearch } from "../../components/handleQcSearch";
import { useNavigate } from "react-router-dom";

const Tools = () => {
  const [qcSearchInput, setQcSearchInput] = useState("");
  const navigate = useNavigate();

  return (
    <div className="container pb-20">
      <h1 className="text-center pt-40 md:pt-28 duration-300 text-4xl mb-6">
        Tools
      </h1>
      <div className="flex flex-wrap gap-6 max-w-7xl mx-auto">
        {/* QC Lookup Card */}
        <div className="flex-1 min-w-[300px] bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold">QC Lookup</h2>
          <p className="text-gray-600 text-sm mt-2">
            Enter a product link to verify its quality
          </p>

          <div className="flex justify-between mt-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-green-500 mb-1">
                <Search size={20} />
              </div>
              <span className="text-xs text-gray-600 max-w-[80px]">
                Real customer photos
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 mb-1">
                <Users size={20} />
              </div>
              <span className="text-xs text-gray-600 max-w-[80px]">
                Avoid Bait & Switch sellers
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-yellow-500 mb-1">
                <Clock size={20} />
              </div>
              <span className="text-xs text-gray-600 max-w-[80px]">
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
              className="w-full px-3 py-2 dark:text-black border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent rounded-lg text-sm"
            />
            <button
              onClick={() => handleQcSearch(qcSearchInput, navigate)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-btn text-white p-1.5 rounded-lg"
            >
              <Search size={16} />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Supported sites: Taobao, Weidian, 1688, Tmall, CNFans, AllChinaBuy,
            SuperBuy, etc.
          </p>
        </div>

        {/* Community Card */}
        <div className="flex-1 min-w-[300px] bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold">Join our Community</h2>
          <p className="text-gray-600 text-sm mt-2">
            Connect with other shoppers and get help with your orders
          </p>

          <div className="flex justify-between mt-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 mb-1">
                <Users size={20} />
              </div>
              <span className="text-xs text-gray-600 max-w-[80px]">
                26,000+ members
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-pink-500 mb-1">
                <Users size={20} />
              </div>
              <span className="text-xs text-gray-600 max-w-[80px]">
                Helpful community
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-purple-500 mb-1">
                <Gift size={20} />
              </div>
              <span className="text-xs text-gray-600 max-w-[80px]">
                Frequent Giveaways
              </span>
            </div>
          </div>

          <button className="w-full mt-6 bg-green-500 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-btn transition-colors">
            <MessageSquare size={20} />
            Join Discord Server
            <ExternalLink size={16} />
          </button>
        </div>

        {/* Shipping Calculator Card */}
        <div className="flex-1 min-w-[300px] bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold">Shipping Calculator</h2>
          <p className="text-gray-600 text-sm mt-2">
            Find the cheapest shipping based on your country and parcel weight
          </p>

          <div className="flex justify-around mt-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 mb-1">
                <Clock size={20} />
              </div>
              <span className="text-xs text-gray-600 max-w-[80px]">
                Delivery estimates
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-green-500 mb-1">
                <Scale size={20} />
              </div>
              <span className="text-xs text-gray-600 max-w-[80px]">
                Compare Agents
              </span>
            </div>
          </div>

          <button className="w-full mt-6 bg-green-500 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-btn transition-colors">
            <MessageSquare size={20} />
            Calculate Shipping
            <ExternalLink size={16} />
          </button>
        </div>

        {/* Chrome Extension Card */}
        <div className="flex-1 min-w-[300px] bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold">Chrome Extension</h2>
          <p className="text-gray-600 text-sm mt-2">
            Shop smarter with our browser extension
          </p>

          <div className="flex justify-around mt-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-green-500 mb-1">
                <Link2 size={20} />
              </div>
              <span className="text-xs text-gray-600 max-w-[80px]">
                Auto Link Conversion
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 mb-1">
                <Search size={20} />
              </div>
              <span className="text-xs text-gray-600 max-w-[80px]">
                QC directly on agent
              </span>
            </div>
          </div>

          <button className="w-full mt-6 bg-green-500 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-btn transition-colors">
            <Chrome size={20} />
            Add to Chrome
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tools;

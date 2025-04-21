import { useState } from "react";
import {
  Search,
  Users,
  Clock,
  Scale,
  ExternalLink,
  MessageSquare,
  Link2,
  Chrome,
} from "lucide-react";
import { handleQcSearch } from "../../components/handleQcSearch";
import { Link, useNavigate } from "react-router-dom";

const Tools = () => {
  const [qcSearchInput, setQcSearchInput] = useState("");
  const navigate = useNavigate();

  return (
    <div className="px-4 pb-20 pt-5">
      <h1 className="text-center w-fit mx-auto duration-300 text-2xl font-bold my-6">
        Tools
      </h1>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* QC Lookup Card */}
        <div className="flex-1 min-w-[300px] rounded-xl p-6 shadow-lg border dark:border-shadow">
          <h2 className="text-lg font-semibold text-center">QC Lookup</h2>
          <p className="text-zinc-500 text-sm text-center mt-2">
            Enter a product link to verify its quality
          </p>

          <div className="flex justify-between mt-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-green-500 mb-1">
                <Search size={20} />
              </div>
              <span className="text-xs text-zinc-500 max-w-[80px]">
                Real customer photos
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 mb-1">
                <Users size={20} />
              </div>
              <span className="text-xs text-zinc-500 max-w-[80px]">
                Avoid Bait & Switch sellers
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-yellow-500 mb-1">
                <Clock size={20} />
              </div>
              <span className="text-xs text-zinc-500 max-w-[80px]">
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
              className="w-full px-3 py-2 bg-white dark:bg-black border border- dark:border-shadow focus:outline-none focus:ring-1 focus:ring-btn focus:border-transparent rounded-lg text-sm"
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
          <h2 className="text-lg font-semibold text-center">
            Shipping Calculator
          </h2>
          <p className="text-zinc-500 text-sm text-center mt-2">
            Find the cheapest shipping based on your country
          </p>

          <div className="flex justify-around mt-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 mb-1">
                <Clock size={20} />
              </div>
              <span className="text-xs text-zinc-500 max-w-[80px]">
                Delivery estimates
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-green-500 mb-1">
                <Scale size={20} />
              </div>
              <span className="text-xs text-zinc-500 max-w-[80px]">
                Compare Agents
              </span>
            </div>
          </div>
          <Link to="/estimation">
            <button className="w-full mt-6 hover:bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 bg-btn transition-colors duration-200 ">
              <MessageSquare size={20} />
              Calculate Shipping
              <ExternalLink size={16} />
            </button>
          </Link>
        </div>

        {/* Chrome Extension Card */}
        <div className="flex-1 min-w-[300px] rounded-xl p-6 shadow-lg border dark:border-shadow">
          <h2 className="text-lg font-semibold text-center">
            Chrome Extension
          </h2>
          <p className="text-zinc-500 text-sm text-center mt-2">
            Shop smarter with our browser extension
          </p>

          <div className="flex justify-around mt-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-green-500 mb-1">
                <Link2 size={20} />
              </div>
              <span className="text-xs text-zinc-500 max-w-[80px]">
                Remove Warm Reminder
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 mb-1">
                <Search size={20} />
              </div>
              <span className="text-xs text-zinc-500 max-w-[80px]">
                QC directly on agent
              </span>
            </div>
          </div>

          <Link
            to="https://chromewebstore.google.com/detail/cnfans-risk-reminder-remo/klkmdlceadbnkoeklinelidmhpjkdgbj?utm_source=item-share-cp&pli=1"
            target="_blank"
          >
            <button className="w-full mt-6 hover:bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 bg-btn transition-colors duration-200 ">
              <Chrome size={20} />
              Add to Chrome
              <ExternalLink size={16} />
            </button>
          </Link>
        </div>

        {/* Image Search Card */}
        {/* <div className="flex-1 min-w-[300px] rounded-xl p-6 shadow-lg border dark:border-shadow">
          <h2 className="text-lg font-semibold text-center">Image Search</h2>
          <p className="text-zinc-500 text-sm text-center mt-2">
            Upload an image to find similar products
          </p>

          <div className="flex justify-around mt-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-green-500 mb-1">
                <Search size={20} />
              </div>
              <span className="text-xs text-zinc-500 max-w-[80px]">
                Visual search technology
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 mb-1">
                <Upload size={20} />
              </div>
              <span className="text-xs text-zinc-500 max-w-[80px]">
                Drag & drop support
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-yellow-500 mb-1">
                <Sparkles size={20} />
              </div>
              <span className="text-xs text-zinc-500 max-w-[80px]">
                Simple & Effective
              </span>
            </div>
          </div>

          <button className="w-full mt-6 hover:bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 bg-btn transition-colors duration-200 ">
            <Image size={20} />
            Image Search
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Tools;

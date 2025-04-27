import { X } from "lucide-react";
import { useState, useEffect } from "react";
import useAgent from "../hooks/useAgent";
import { IAgent } from "../types/agent.type";

interface UseAgentResult {
  agentData: IAgent[];
}

const PlatformSwitcher = () => {
  const { agentData } = useAgent({ active: "true" }) as UseAgentResult;
  const [selectedPlatform, setSelectedPlatform] = useState<string>(
    () => localStorage.getItem("platform") || "CNFans"
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    () =>
      localStorage.getItem("platform_img") ||
      agentData.find((platform) => platform.name === selectedPlatform)?.img ||
      ""
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const platform_img = agentData.find(
      (agent) => agent.name === selectedPlatform
    )?.img;

    localStorage.setItem("platform", selectedPlatform);
    if (platform_img) {
      setSelectedImage(platform_img);
      localStorage.setItem("platform_img", platform_img);
    }
  }, [selectedPlatform, agentData]);

  return (
    <div className="relative">
      <button
        className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Platform switcher"
        onClick={() => setIsOpen(true)}
      >
        {selectedImage && (
          <img className="w-6 h-6 rounded" src={selectedImage} alt="platform" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 py-6 pl-6 pr-4 rounded-lg shadow-lg max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select an agent
            </h2>
            <p className="text-sm mb-4 text-zinc-500">
              Select the agent you want to buy on
            </p>
            <div
              className={`overflow-y-scroll max-h-[420px] scrollbar-visible scroll-px-1`}
            >
              {agentData.map((agent, index) => (
                <button
                  key={agent.name}
                  className={`relative flex items-center gap-4 w-full border rounded-lg transition-colors mb-2 ${
                    selectedPlatform === agent.name
                      ? "border-green-500 bg-green-100 dark:bg-green-900"
                      : index === 0
                      ? "border-gray-300 bg-red-50 dark:bg-red-800 dark:border-gray-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onClick={() => {
                    setSelectedPlatform(agent.name);
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={agent.img}
                    alt={agent.name}
                    className="w-12 h-12 object-contain mx-auto rounded-l-lg"
                    loading="lazy"
                  />
                  <div className="w-full text-left">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {agent.name}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                      {agent?.offer}
                    </p>
                  </div>
                  {index === 0 && (
                    <p className="absolute top-0 right-0 bg-red-200 text-xs py-0.5 px-2 rounded-tr-lg rounded-bl-lg dark:bg-red-950">
                      Recommended
                    </p>
                  )}
                </button>
              ))}
            </div>
            <button
              className="text-red-500 absolute top-2 right-2 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformSwitcher;

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import Oopbuy from "../assets/Oopbuy.webp";
import ACBuy from "../assets/Acbuy.webp";
import Ootdbuy from "../assets/Ootdbuy.webp";
import Lovegobuy from "../assets/Lovegobuy.jpeg";
import Hippoobuy from "../assets/Hippoobuy.jpeg";
import CSSBuy from "../assets/Cssbuy.jpeg";
import CNFans from "../assets/Cnfans.webp";
import Loongbuy from "../assets/Loongbuy.webp";
import Mulebuy from "../assets/Mulebuy.jpeg";
import Joyabuy from "../assets/Joyabuy.webp";
import Eastmallbuy from "../assets/Eastmallbuy.webp";
import Superbuy from "../assets/Superbuy.webp";

const platforms = [
  { name: "Oopbuy", img: Oopbuy },
  { name: "ACBuy", img: ACBuy },
  { name: "Ootdbuy", img: Ootdbuy },
  { name: "Lovegobuy", img: Lovegobuy },
  { name: "Hippoobuy", img: Hippoobuy },
  { name: "CSSBuy", img: CSSBuy },
  { name: "CNFans", img: CNFans },
  { name: "Loongbuy", img: Loongbuy },
  { name: "Mulebuy", img: Mulebuy },
  { name: "Joyabuy", img: Joyabuy },
  { name: "Eastmallbuy", img: Eastmallbuy },
  { name: "Superbuy", img: Superbuy },
];

const PlatformSwitcher = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(
    () => localStorage.getItem("platform") || "CNFans"
  );
  const [selectedImage, setSelectedImage] = useState(
    () =>
      localStorage.getItem("platform_img") ||
      platforms.find((platform) => platform.name === selectedPlatform)?.img ||
      ""
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const platform_img = platforms.find(
      (platform) => platform.name === selectedPlatform
    )?.img;

    localStorage.setItem("platform", selectedPlatform);
    if (platform_img) {
      setSelectedImage(platform_img);
      localStorage.setItem("platform_img", platform_img);
    }
  }, [selectedPlatform]);

  return (
    <div className="relative">
      <button
        className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Platform switcher"
        onClick={() => setIsOpen(true)}
      >
        <img className="w-6 h-6 rounded" src={selectedImage} alt="platform" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select a Platform
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  className={`border p-2 rounded-lg transition-colors ${
                    selectedPlatform === platform.name
                      ? "border-green-500 bg-green-100 dark:bg-green-900"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onClick={() => {
                    setSelectedPlatform(platform.name);
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={platform.img}
                    alt={platform.name}
                    className="w-16 h-16 object-contain mx-auto"
                  />
                  <p className="text-center mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {platform.name}
                  </p>
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

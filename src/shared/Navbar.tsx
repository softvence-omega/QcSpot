import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useState } from "react";
import { handleQcSearch } from "../components/handleQcSearch";
import logo from "../assets/QcSpot-Logo-design-1.png";
import logo_dark from "../assets/QcSpot-Logo-design-2.png";
import { useTheme } from "../context/ThemeContext";
import PlatformSwitcher from "../components/PlatformSwitcher";

const Navbar = () => {
  const [qcSearchInput, setQcSearchInput] = useState("");
  const { theme } = useTheme();

  const navigate = useNavigate();
  const searchHandler = () => {
    handleQcSearch(qcSearchInput, navigate);
    setQcSearchInput("");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-dark shadow-md dark:shadow-shadow z-50 transition-colors duration-200">
      <nav className="mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          {(() => {
            // Determine the effective theme
            const isDarkMode =
              theme === "dark" ||
              (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);
            return (
              <img
                className="w-32"
                src={isDarkMode ? logo_dark : logo}
                alt="logo"
              />
            );
          })()}
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              value={qcSearchInput}
              onChange={(e) => setQcSearchInput(e.target.value)}
              placeholder="Enter product URL for QC search"
              className="w-full px-4 py-2 rounded-lg border border-r-0 border-gray-300 dark:border-gray-600 
                       focus:outline-none focus:ring-1 focus:ring-btn focus:border-transparent
                       dark:bg-black dark:text-white transition-colors"
            />
            <button
              onClick={searchHandler}
              className="absolute right-0 top-0 h-full bg-btn px-4 rounded-r-md 
                           hover:bg-green-600 transition-colors"
            >
              <Search className="text-white w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <PlatformSwitcher />
          <ThemeSwitcher />
          <Link
            to="/login"
            className="bg-btn text-white px-6 py-2 rounded-md hover:bg-green-600 
                     transition-colors duration-200 font-medium"
          >
            Login / Signup
          </Link>
        </div>
      </nav>

      {/* Mobile Search - Shown below navbar on smaller screens */}
      <div className="md:hidden px-4 py-2 bg-gray-50 dark:bg-black transition-colors">
        <div className="relative">
          <input
            type="text"
            value={qcSearchInput}
            onChange={(e) => setQcSearchInput(e.target.value)}
            placeholder="Enter product URL for QC search"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                     dark:bg-black dark:text-white transition-colors"
          />
          <button
            onClick={searchHandler}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

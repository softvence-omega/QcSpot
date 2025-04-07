import { Heart, LayoutDashboard, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useState } from "react";
import { handleQcSearch } from "../components/handleQcSearch";
import logo from "../assets/QcSpot-Logo-design-1.png";
import logo_dark from "../assets/QcSpot-Logo-design-2.png";
import { useTheme } from "../context/ThemeContext";
import PlatformSwitcher from "../components/PlatformSwitcher";
import { useAuth } from "../context/AuthContext";
import { PiSignOutBold } from "react-icons/pi";

const Navbar = () => {
  const [qcSearchInput, setQcSearchInput] = useState("");
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  console.log(user);

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
              className="w-full pl-3 pr-16 py-2 rounded-lg border border-r-0 border-gray-300 dark:border-gray-600 
                       focus:outline-none focus:ring-1 focus:ring-btn focus:border-transparent
                       bg-white dark:bg-black dark:text-white transition-colors"
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
          {user &&
            (user?.role == "admin" ? (
              // Admin Dashboard
              <div className="relative group">
                <Link to="/dashboard/admin-home">
                  <LayoutDashboard className="cursor-pointer" />
                </Link>
                <span className="absolute z-30 left-1/2 top-full mt-2 mb-2 w-max -translate-x-1/2 scale-0 transition-all rounded bg-btn px-1 text-xs text-white group-hover:scale-100">
                  Dashboard
                </span>
              </div>
            ) : (
              // User Collection
              <div className="relative group">
                <Link to="/collection">
                  <Heart className="cursor-pointer text-btn" fill="#32854e" />
                </Link>
                <span className="absolute z-30 left-1/2 top-full mt-2 mb-2 w-max -translate-x-1/2 scale-0 transition-all rounded bg-btn px-1 text-xs text-white group-hover:scale-100">
                  My Collection
                </span>
              </div>
            ))}
          <div className="relative group">
            <PlatformSwitcher />
            <span className="absolute z-30 left-1/2 top-full mt-1 mb-2 w-max -translate-x-1/2 scale-0 transition-all rounded bg-btn px-1 text-xs text-white group-hover:scale-100">
              Select Platforms
            </span>
          </div>
          <ThemeSwitcher />
          <div className="hidden sm:block">
            {!user ? (
              <Link
                to="/login"
                className="bg-btn text-white px-6 py-2 rounded-md hover:bg-green-600 
                     transition-colors duration-200 font-medium"
              >
                Login / Signup
              </Link>
            ) : (
              <button
                onClick={logout}
                className="relative group text-red-500 hover:text-red-800 duration-200 font-medium text-2xl"
              >
                <PiSignOutBold />
                <span className="absolute mt-2 z-30 left-1/2 top-full mb-2 w-max -translate-x-1/2 scale-0 transition-all rounded bg-btn px-1 text-xs text-white group-hover:scale-100">
                  Logout
                </span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ---------------- On smaller screens ----------------- */}
      <div className="md:hidden flex items-center gap-3 px-4 py-2 ">
        {/* Mobile Search */}
        <div className="w-full md:hidden bg-gray-50 dark:bg-black transition-colors">
          <div className="relative">
            <input
              type="text"
              value={qcSearchInput}
              onChange={(e) => setQcSearchInput(e.target.value)}
              placeholder="Enter product URL for QC search"
              className="w-full pl-4 pr-8 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                     bg-white dark:bg-black dark:text-white transition-colors"
            />
            <button
              onClick={searchHandler}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-btn hover:text-green-500 dark:hover:text-btn dark:text-green-500 duration-300"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Mobile Login button */}
        <div className="sm:hidden block">
          {!user ? (
            <Link
              to="/login"
              className="bg-btn text-white px-5 py-3 rounded-md hover:bg-green-600 
                     transition-colors duration-200 font-medium"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="relative group text-red-500 hover:text-red-800 duration-200 font-medium text-2xl"
            >
              <PiSignOutBold />
              <span className="absolute mt-2 z-30 left-1/2 top-full mb-2 w-max -translate-x-1/2 scale-0 transition-all rounded bg-btn px-1 text-xs text-white group-hover:scale-100">
                Logout
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

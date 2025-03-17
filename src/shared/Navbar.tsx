import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-50 transition-colors duration-200">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <p className="text-2xl font-bold tracking-widest text-gray-900 dark:text-white transition-colors">
            <span className="bg-orange-500 text-white px-2 mr-1 rounded">
              QC
            </span>
            SPOT
          </p>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter product URL for QC search"
              className="w-full px-4 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                       dark:bg-gray-700 dark:text-white transition-colors"
            />
            <button
              className="absolute right-0 top-0 h-full bg-orange-500 px-4 rounded-r-md 
                           hover:bg-orange-600 transition-colors"
            >
              <Search className="text-white w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <ThemeSwitcher />
          <Link
            to="/login"
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 
                     transition-colors duration-200 font-medium"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Mobile Search - Shown below navbar on smaller screens */}
      <div className="md:hidden px-4 py-2 bg-gray-50 dark:bg-gray-700 transition-colors">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter product URL for QC search"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                     dark:bg-gray-600 dark:text-white transition-colors"
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 
                         text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

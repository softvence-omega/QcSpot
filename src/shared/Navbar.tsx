import { useState, useEffect } from "react";
import { Sun, Moon, Search } from "lucide-react";

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-bold tracking-widest text-black dark:text-white">
            FINDS
            <span className="bg-orange-500 text-white px-2 rounded">LY</span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Enter product URL for QC search"
            className="px-4 py-2 w-64 outline-none dark:bg-gray-800 dark:text-white"
          />
          <button className="bg-orange-500 p-2">
            <Search className="text-white w-5 h-5" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Switcher */}
          <div className="relative group">
            <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
              {theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setTheme("light")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Dark
              </button>
              <button
                onClick={() => setTheme("system")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                System
              </button>
            </div>
          </div>

          {/* Profile Button */}
          <button className="bg-orange-500 text-white px-4 py-2 rounded-md">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

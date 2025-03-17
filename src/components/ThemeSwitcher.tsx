import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative group">
      <button
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                 dark:hover:bg-gray-600 transition-colors"
        aria-label="Theme switcher"
      >
        {theme === "dark" ? (
          <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        ) : theme === "system" ? (
          <Monitor className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        ) : (
          <Sun className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        )}
      </button>

      <div
        className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg 
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                    transition-all duration-200 ease-in-out z-50"
      >
        <div className="py-1">
          <button
            onClick={() => setTheme("light")}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Sun className="w-4 h-4 mr-2" />
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Moon className="w-4 h-4 mr-2" />
            Dark
          </button>
          <button
            onClick={() => setTheme("system")}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Monitor className="w-4 h-4 mr-2" />
            System
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;

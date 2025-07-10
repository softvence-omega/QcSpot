import { Link, Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import instagram from "../assets/instagram.svg";
import telegram from "../assets/telegram.svg";
import reddit from "../assets/reddit-svgrepo-com.svg";
const MainLayout = () => {
  const { setUser } = useAuth();
  useEffect(() => {
    if (!localStorage.getItem("user")) setUser(null);
  }, [setUser]);
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-dark text-black dark:text-white transition-colors duration-200">
      <Navbar />
      <Outlet />
      <Footer />
{/* Social Media Buttons */}
<div className="fixed bottom-4 right-4 flex flex-col-reverse gap-2 z-50">
   {/* Instagram button */}
      <div className="w-fit hover:scale-110 transition-transform duration-200">
        <Link
          to="https://www.instagram.com/qcspot?igsh=MjNtczVlMDlsMmQ4&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={instagram}
            alt="Instagram"
            className="w-10 h-10 cursor-pointer"
          />
        </Link>
      </div>

      {/* Telegram button */}
      <div className=" w-fit hover:scale-110 transition-transform duration-200">
        <Link
          to="https://t.me/+I-_POEYtIXg5ODRh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={telegram}
            alt="Instagram"
            className="w-10 h-10 cursor-pointer"
          />
        </Link>
      </div>

      {/* Raddit button */}
      <div className=" w-fit hover:scale-110 transition-transform duration-200">
        <Link
          to="https://www.reddit.com/r/RepSchool/s/YjCTaCroYg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={reddit}
            alt="Instagram"
            className="w-10 h-10 cursor-pointer"
          />
        </Link>
      </div>

</div>
      


    </div>
  );
};

export default MainLayout;

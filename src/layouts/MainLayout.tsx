import { Link, Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import insta from "../assets/instagram.svg";

const MainLayout = () => {
  const { setUser } = useAuth();
  useEffect(() => {
    if (!localStorage.getItem("user")) setUser(null);
  }, [localStorage]);
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-dark text-black dark:text-white transition-colors duration-200">
      <Navbar />
      <Outlet />
      <Footer />
      <div className="fixed bottom-5 right-5 w-fit">
        <Link
          to="https://www.instagram.com/qcspot?igsh=MjNtczVlMDlsMmQ4&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={insta}
            alt="Instagram"
            className="w-10 h-10 cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
};

export default MainLayout;

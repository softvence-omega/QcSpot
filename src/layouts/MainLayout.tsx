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
      <Link
        className="sticky bottom-5 flex justify-end mr-5 cursor-pointer"
        to="https://www.instagram.com/qcspot?igsh=MjNtczVlMDlsMmQ4&utm_source=qr"
        target="_blank"
      >
        <img className=" w-10 h-10" src={insta} alt="Instagram" />
      </Link>
    </div>
  );
};

export default MainLayout;

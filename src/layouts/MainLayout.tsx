import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const { setUser } = useAuth();
  useEffect(() => {
    if (!localStorage.getItem("user")) setUser(null);
  }, [localStorage]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark text-black dark:text-white transition-colors duration-200">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;

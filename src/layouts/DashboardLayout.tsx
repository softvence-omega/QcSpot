import ActiveLink from "../components/ActiveLink";
import { FaCartPlus, FaHome } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import { IoIosAddCircle, IoMdPerson } from "react-icons/io";
import { IoCardOutline } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import logo from "../assets/QcSpot-Logo-design-2.png";

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-gray-50 dark:bg-dark text-black dark:text-white transition-colors duration-200">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content m-2 lg:m-0">
        <label
          htmlFor="my-drawer-2"
          className="fixed text-xl sm:text-2xl md:text-3xl text-btn cursor-pointer rounded-full drawer-button lg:hidden"
        >
          <span>☰</span>
        </label>
        <Outlet></Outlet>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

        <ul className="p-4 w-56 sm:w-64 lg:w-[280px] duration-300 max-w-sm h-full bg-title bg-btn text-white">
          <li>
            <div className="flex gap-5 mt-3 mb-5">
              <Link to="/" className="flex justify-center items-center gap-3">
                <img className="w-32" src={logo} alt="" />
              </Link>
            </div>
          </li>
          <li>
            <ActiveLink to="/dashboard/admin-home">
              <div className="flex items-center gap-2 text-sm sm:text-base duration-300">
                <FaHome /> Admin Home
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink to="/dashboard/users">
              <div className="flex items-center gap-2 text-sm sm:text-base duration-300">
                <IoMdPerson /> All Users
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink to="/dashboard/add-a-product">
              <div className="flex items-center gap-2 text-sm sm:text-base duration-300">
                <IoIosAddCircle /> Add a Product
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink to="/dashboard/manage-products">
              <div className="flex items-center gap-2 text-sm sm:text-base duration-300">
                <FaCartPlus /> Manage Products
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink to="/dashboard/set-agent">
              <div className="flex items-center gap-2 text-sm sm:text-base duration-300">
                <IoCardOutline /> Set Agent
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink to="/dashboard/change-password">
              <div className="flex items-center gap-2 text-sm sm:text-base duration-300">
                <RiLockPasswordFill /> Change password
              </div>
            </ActiveLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;

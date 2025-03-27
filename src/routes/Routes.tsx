import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProductDetails from "../pages/ProductDetails";
import AddAProduct from "../pages/dashboard/AddAProduct";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminHome from "../pages/dashboard/AdminHome";
import ManageProducts from "../pages/dashboard/ManageProducts";
import ChangePassword from "../pages/dashboard/ChangePassword";
import Users from "../pages/dashboard/users";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "/product/:shopType/:id", element: <ProductDetails /> },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "admin-home", element: <AdminHome /> },
      { path: "add-a-product", element: <AddAProduct /> },
      { path: "manage-products", element: <ManageProducts /> },
      { path: "users", element: <Users /> },
      { path: "change-password", element: <ChangePassword /> },
    ],
  },
]);

export default router;

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import AddAProduct from "../pages/dashboard/AddAProduct";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminHome from "../pages/dashboard/AdminHome";
import ManageProducts from "../pages/dashboard/ManageProducts";
import ChangePassword from "../pages/dashboard/ChangePassword";
import Users from "../pages/dashboard/Users";
import ManageProductsDetails from "../pages/dashboard/ManageProductsDetails";
import PrivateRoute from "./PrivateRoute";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import PopularPage from "../pages/PopularPage";
import Collection from "../pages/Collection";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/product/:shopType/:id", element: <ProductDetailsPage /> },
      { path: "/popular", element: <PopularPage /> },
      {
        path: "/collection",
        element: (
          <PrivateRoute>
            <Collection />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "admin-home", element: <AdminHome /> },
      { path: "add-a-product", element: <AddAProduct /> },
      { path: "manage-products", element: <ManageProducts /> },
      { path: "manage-products/:id", element: <ManageProductsDetails /> },
      { path: "users", element: <Users /> },
      { path: "change-password", element: <ChangePassword /> },
    ],
  },
  { path: "register", element: <RegisterPage /> },
  { path: "login", element: <LoginPage /> },
  {
    path: "reset-password",
    element: (
      // <PrivateRoute>
      <ResetPasswordPage />
      // </PrivateRoute>
    ),
  },
]);

export default router;

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
import PrivateRoute from "./PrivateRoute";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import PopularPage from "../pages/PopularPage";
import Collection from "../pages/Collection";
import ManageAgent from "../pages/dashboard/ManageAgent";
import AddAnAgent from "../pages/dashboard/AddAnAgent";
import Estimation from "../pages/Estimation";
import Managereview from "../pages/dashboard/ManageReview";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import AdminPrivateRoute from "./AdminPrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/popular", element: <PopularPage /> },
      { path: "/product/:shopType/:id", element: <ProductDetailsPage /> },
      { path: "/estimation", element: <Estimation /> },
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
      <AdminPrivateRoute>
        <DashboardLayout />
      </AdminPrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "admin-home", element: <AdminHome /> },
      { path: "add-a-product", element: <AddAProduct /> },
      { path: "manage-products", element: <ManageProducts /> },
      { path: "add-an-agent", element: <AddAnAgent /> },
      { path: "users", element: <Users /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "manage-agent", element: <ManageAgent /> },
      { path: "manage-review", element: <Managereview /> },
    ],
  },
  { path: "register", element: <RegisterPage /> },
  { path: "login", element: <LoginPage /> },
  {
    path: "reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "verify-email",
    element: <VerifyEmailPage />,
  },
]);

export default router;

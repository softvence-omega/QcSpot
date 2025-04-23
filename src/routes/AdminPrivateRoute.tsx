import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const AdminPrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loader />;

  if (user && user.role === "admin") return children;
  else if (user && user.role !== "admin") return <Navigate to="/" replace />;
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminPrivateRoute;

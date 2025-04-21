import { Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminHome = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h2 className="text-2xl md:text-4xl">Welcome Home, Mr. {user?.name}</h2>
      <p className="flex items-center gap-2 mt-4">
        <Mail /> {user?.email}
      </p>
    </div>
  );
};

export default AdminHome;

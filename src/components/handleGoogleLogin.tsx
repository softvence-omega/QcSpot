import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../firebase/firebase.config";
import axiosSecure from "../hooks/useAxios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useUsers from "../hooks/useUsers";

export const useGoogleLogin = (
  setIsOpen: (val: boolean) => void,
  setTempUser: (user: any) => void
) => {
  const { usersData } = useUsers();
  const auth = getAuth(app);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isUserExists = usersData?.find((u: any) => u.email === user.email);
      if (!isUserExists) {
        // Show password popup and store temp user info
        setTempUser(user);
        setIsOpen(true);
        return;
      }
      await loginUser(user.email as string, setUser, navigate);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data?.message || "Something went wrong!");
      } else {
        toast.error("Failed to Login. Please try again.");
      }
    }
  };

  return handleGoogleLogin;
};

export const loginUser = async (
  email: string,
  setUser: Function,
  navigate: Function
) => {
  try {
    const res = await axiosSecure.post("/auth/login", {
      email,
      method: "google",
    });

    if (res.status === 200) {
      const token = res.data?.approvalToken;
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data?.user));
      setUser(res.data?.user);
      toast.success("Logged in successfully!");
      res.data?.user?.role === "admin"
        ? navigate("/dashboard/admin-home")
        : navigate("/");
    } else toast.error("Unexpected response from server.");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Login failed");
  }
};

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../firebase/firebase.config";
import axiosSecure from "../hooks/useAxios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useGoogleLogin = (
  setIsOpen: (val: boolean) => void,
  setTempUser: (user: any) => void
) => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Always try to login first, server will tell us if user exists
      await loginUser(user, setUser, navigate, setIsOpen, setTempUser);
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
  user: any,
  setUser: Function,
  navigate: Function,
  setIsOpen?: (val: boolean) => void,
  setTempUser?: (user: any) => void
) => {
  try {
    const res = await axiosSecure.post("/auth/login", {
      email: user.email,
      method: "google",
    });
    console.log(res);
    if (res.status === 200) {
      const token = res.data?.approvalToken;
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data?.user));
      setUser(res.data?.user);
      toast.success("Logged in successfully!");
      res.data?.user?.role === "admin"
        ? navigate("/dashboard/admin-home")
        : navigate("/");
    } else {
      toast.error("Unexpected response from server.");
    }
  } catch (error: any) {
    if (!error.response.data?.success) {
      // User not found - show password popup for new user
      if (setIsOpen && setTempUser) {
        setTempUser(user);
        setIsOpen(true);
      } else {
        toast.error("Please complete your registration first.");
      }
    } else {
      toast.error(error.response?.data?.message || "Login failed");
    }
  }
};

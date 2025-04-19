import React, { useState } from "react";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosSecure from "../hooks/useAxios";
import { loginUser, useGoogleLogin } from "../components/handleGoogleLogin.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import app from "../firebase/firebase.config.ts";
import Swal from "sweetalert2";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const [googlePassLoading, setGooglePassLoading] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const auth = getAuth(app);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    const registerData = { name, email, password };
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send email verification to ensure verified user
      await sendEmailVerification(result.user);
      Swal.fire({
        title: "Check Your mail to verify email address",
        icon: "info",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      await signOut(auth);

      // Then create the user
      const res = await axiosSecure.post("/users/createUser", registerData);
      if (res.status === 200) navigate("/login");
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data?.message || "Something went wrong!");
      } else {
        toast.error("Failed to Register. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin(setIsPassOpen, setTempUser);
  const handleCreateUser = async () => {
    setGooglePassLoading(true);
    if (!googlePassword) {
      toast.error("Please fill in all fields");
      setGooglePassLoading(false);
      return;
    }
    try {
      const formValue = {
        email: tempUser.email,
        name: tempUser.displayName,
        password: googlePassword,
      };

      try {
        // Try to create user in firebase
        await createUserWithEmailAndPassword(
          auth,
          tempUser.email,
          googlePassword
        );

        // If creation successful, create user in your backend too
        await axiosSecure.post("/users/createUser", formValue);
        toast.success("User registered successfully!");
      } catch (firebaseError: any) {
        // If email already exists, try to log the user in
        if (firebaseError.code === "auth/email-already-in-use") {
          await signInWithEmailAndPassword(
            auth,
            tempUser.email,
            googlePassword
          );
        } else if (firebaseError.code === "auth/invalid-email") {
          toast.error("Invalid email address.");
          return;
        } else if (firebaseError.code === "auth/weak-password") {
          toast.error("Password is too weak.");
          return;
        } else {
          toast.error("Firebase authentication error. Please try again.");
          return;
        }
      }
      await signOut(auth);

      // Proceed to login
      await loginUser(tempUser, setUser, navigate, setIsPassOpen, setTempUser);
      setIsPassOpen(false);
      setGooglePassword("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create user.");
    } finally {
      setGooglePassLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-dark transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-green-500 hover:text-btn"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleEmailRegister}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 
                           border border-gray-300 dark:border-gray-600 
                           placeholder-gray-500 dark:placeholder-gray-400 
                           text-gray-900 dark:text-white 
                           rounded-md 
                           bg-white dark:bg-gray-700
                           focus:outline-none focus:ring-green-500 focus:border-green-500 
                           sm:text-sm
                           transition-colors"
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 
                           border border-gray-300 dark:border-gray-600 
                           placeholder-gray-500 dark:placeholder-gray-400 
                           text-gray-900 dark:text-white 
                           rounded-md 
                           bg-white dark:bg-gray-700
                           focus:outline-none focus:ring-green-500 focus:border-green-500 
                           sm:text-sm
                           transition-colors"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 
                           border border-gray-300 dark:border-gray-600 
                           placeholder-gray-500 dark:placeholder-gray-400 
                           text-gray-900 dark:text-white 
                           rounded-md 
                           bg-white dark:bg-gray-700
                           focus:outline-none focus:ring-green-500 focus:border-green-500 
                           sm:text-sm
                           transition-colors"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 
                           border border-gray-300 dark:border-gray-600 
                           placeholder-gray-500 dark:placeholder-gray-400 
                           text-gray-900 dark:text-white 
                           rounded-md 
                           bg-white dark:bg-gray-700
                           focus:outline-none focus:ring-green-500 focus:border-green-500 
                           sm:text-sm
                           transition-colors"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 
                       border border-transparent text-sm font-medium rounded-md 
                       text-white hover:bg-green-500 bg-btn duration-200
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 
                       border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                       text-sm font-medium text-gray-700 dark:text-gray-200 
                       bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                       transition-colors"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              Sign up with Google
            </button>
          </div>
        </form>
      </div>

      {/* Set a Password Modal */}
      {isPassOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hi {tempUser?.displayName}, set a password
            </h2>
            <div className="popup">
              <input
                type="password"
                value={googlePassword}
                className="appearance-none relative block w-full px-3 py-2 pl-10 
                border border-gray-300 dark:border-gray-600 
                placeholder-gray-500 dark:placeholder-gray-400 
                text-gray-900 dark:text-white 
                rounded-md 
                bg-white dark:bg-gray-700
                focus:outline-none focus:ring-green-500 focus:border-green-500 
                sm:text-sm
                transition-colors"
                onChange={(e) => setGooglePassword(e.target.value)}
                placeholder="Set a password"
              />
              <button
                disabled={googlePassLoading}
                onClick={handleCreateUser}
                className="group relative w-full flex justify-center py-2 px-4 
                       border border-transparent text-sm font-medium rounded-md 
                       text-white hover:bg-green-500 bg-btn duration-200
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                       transition-colors mt-5"
              >
                {googlePassLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Set Password"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;

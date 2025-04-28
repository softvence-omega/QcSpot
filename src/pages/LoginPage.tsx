import { FormEvent, useState } from "react";
import { Mail, Lock, Loader2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosSecure from "../hooks/useAxios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { loginUser, useGoogleLogin } from "../components/handleGoogleLogin";

function Login() {
  const [email, setEmail] = useState("");
  const [forgetPassMail, setForgetPassMail] = useState("");
  const [password, setPassword] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotPassLoading, setForgotPassLoading] = useState(false);
  const [googlePassLoading, setGooglePassLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);
    if (!email || !password) {
      toast.error("Please fill in all fields");
      setLoginLoading(false);
      return;
    }
    const formValue = { email, password };
    try {
      const res = await axiosSecure.post("/auth/login", formValue);
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
      if (error.response) {
        if (error.response.data?.message == "User is not verified.") {
          const result = await Swal.fire({
            title: "Email not verified",
            text: "Would you like us to resend the verification email?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Resend",
            cancelButtonText: "Cancel",
          });

          if (result.isConfirmed) {
            await axiosSecure.post("/users/requestVerificationEmail", {
              email,
            });
            toast.success("Verification email resent. Check your inbox.");
          } else {
            toast.error("Email verification required to continue.");
          }
          return;
        } else
          toast.error(
            error.response.data?.message || "Invalid username or password"
          );
      } else {
        toast.error("Failed to login. Please try again.");
      }
    } finally {
      setLoginLoading(false);
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
      await axiosSecure.post("/users/createUser", formValue);
      setIsPassOpen(false);
      setGooglePassword("");

      // Proceed to login
      await loginUser(tempUser, setUser, navigate, setIsPassOpen, setTempUser);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create user.");
    } finally {
      setGooglePassLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setForgotPassLoading(true);
      const res = await axiosSecure.post("/auth/forgetPassword", {
        email: forgetPassMail,
      });
      if (res.status !== 200) toast.error("Network response was not ok");
      Swal.fire("Please check your mail!");
      setIsOpen(false);
    } catch (error: any) {
      if (error.response) {
        toast.error(
          error.response.data?.message || "Invalid username or password"
        );
      } else {
        toast.error("Failed to login. Please try again.");
      }
    } finally {
      setForgotPassLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 bg-gray-50 dark:bg-dark transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-green-500 hover:text-btn"
            >
              Register here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center ">
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
            <p
              onClick={() => setIsOpen(true)}
              className="text-xs text-right hover:text-green-500 cursor-pointer duration-300"
            >
              Forgot Password?
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginLoading}
              className="group relative w-full flex justify-center py-2 px-4 
                       border border-transparent text-sm font-medium rounded-md 
                       text-white hover:bg-green-500 bg-btn duration-200
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              {loginLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

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

        {/* Sign up with google */}
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
          Sign in with Google
        </button>
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

      {/* Forgot Password Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Please provide your mail
            </h2>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center ">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={forgetPassMail}
                  onChange={(e) => setForgetPassMail(e.target.value)}
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
            <button
              disabled={forgotPassLoading}
              onClick={handleForgotPassword}
              className="group relative w-full flex justify-center py-2 px-4 
                       border border-transparent text-sm font-medium rounded-md 
                       text-white hover:bg-green-500 bg-btn duration-200
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                       transition-colors mt-5"
            >
              {forgotPassLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Send Mail"
              )}
            </button>
            <button
              className="text-red-500 absolute top-2 right-2 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

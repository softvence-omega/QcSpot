import { FormEvent, useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosSecure from "../hooks/useAxios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formValue = {
      email: form.email.value,
      password: form.password.value,
    };

    try {
      const res = await axiosSecure.post("/auth/login", formValue);
      if (res.status === 200) {
        toast.success("Logged in successfully!");
        navigate("/");
      } else toast.error("Unexpected response from server.");
    } catch (error: any) {
      if (error.response) {
        toast.error(
          error.response.data?.message || "Invalid username or password"
        );
      } else {
        toast.error("Failed to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Add your Google authentication logic here
    } catch (error: any) {
      toast.error(error.message || "Failed to login with Google");
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4 bg-gray-50 dark:bg-dark transition-colors">
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                "Sign in"
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
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

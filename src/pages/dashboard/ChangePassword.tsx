import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosSecure from "../../hooks/useAxios";
import toast from "react-hot-toast";
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import app from "../../firebase/firebase.config";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>();
  const auth = getAuth(app);
  const navigate = useNavigate();
  const onSubmit = async (data: any) => {
    if (data?.newPassword !== data?.confirmPassword) {
      toast.error("Password did not Match!");
      return;
    }
    const changePasswordData = {
      oldPassword: data?.oldPassword,
      newPassword: data?.newPassword,
    };
    try {
      setLoading(true);
      const emailPassTry = await signInWithEmailAndPassword(
        auth,
        user?.email as string,
        data?.oldPassword
      );
      const firebaseUser = emailPassTry.user;
      await updatePassword(firebaseUser, data.newPassword);
      const res = await axiosSecure.post(
        "/auth/changePassword",
        changePasswordData
      );
      if (res.status !== 200) toast.error("Something went wrong!");
      toast.success("Password has been updated! Login with new password.");
      navigate("/login");

      reset();
    } catch (error: any) {
      console.error("Error:", error);
      if (error.code === "auth/wrong-password" || "auth/invalid-credential") {
        toast.error("Incorrect current password");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please try again later.");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("Please re-login to change your password.");
      } else
        toast.error(
          error.response?.data?.message || "Failed to change password"
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Change Password
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md"
      >
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            type="password"
            {...register("oldPassword", {
              required: "Current password is required",
            })}
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
          />
          {errors.oldPassword && (
            <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value, { newPassword }) =>
                value === newPassword || "Passwords do not match",
            })}
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-btn text-white py-2 rounded hover:bg-green-500 transition mt-6"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

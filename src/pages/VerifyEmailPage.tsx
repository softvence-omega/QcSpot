import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../hooks/useAxios";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const onSubmit = async () => {
    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosSecure.post(`/users/verifyEmail?token=${token}`);
      if (res.status === 200) {
        toast.success("Email has been verified!");
        navigate("/login");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data?.message || "Failed to verify mail.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-dark transition-colors">
      <div className="max-w-md w-full space-y-8 p-8 rounded-xl">
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          onClick={onSubmit}
          className="w-full bg-btn text-white py-2 rounded hover:bg-green-500 transition mt-6"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            "Click here to Verify Email"
          )}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

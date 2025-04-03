import { ImageOff, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <ImageOff className="w-10 h-10 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn't load the page you're looking for. This might be due to
            an invalid or expired link, missing permissions, or a temporary
            server issue.
          </p>

          {/* Error Code */}
          <div className="bg-gray-50 rounded-lg py-2 px-4 inline-block mb-8">
            <code className="text-gray-600 font-mono">Error 404</code>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 
                       rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white 
                       hover:bg-gray-50 outline-none"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 
                       rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white 
                       hover:bg-gray-50 outline-none"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </button>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent 
                       rounded-md shadow-sm text-sm font-medium text-white bg-green-500 
                       hover:bg-green-600 outline-none"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-sm text-gray-500">
          <p className="font-extrabold">Common solutions:</p>
          <ul className="mt-2 space-y-1">
            <li>• Check your internet connection</li>
            <li>• Verify the URL is correct</li>
            <li>• Make sure you're logged in</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

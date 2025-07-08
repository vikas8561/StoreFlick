import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home or orders after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-pink-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full animate-fade-in-down">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for shopping with us. We’ve received your order and will process it shortly.
        </p>
        <p className="text-sm text-gray-500">Redirecting to home page...</p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition"
          >
            Go to Home Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

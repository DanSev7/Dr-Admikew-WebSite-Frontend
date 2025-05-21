import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Clear appointment data from localStorage on mount
    localStorage.removeItem('appointmentData');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center space-y-6 max-w-md w-full">
        <div>
          <AiOutlineCheckCircle className="text-sky-500" size={100} />
        </div>

        <h2 className="text-3xl font-bold text-sky-600 text-center">
          Payment Successful!
        </h2>

        <p className="text-gray-600 text-center">
          Thank you for your payment. Your transaction has been completed.
          A confirmation email will be sent shortly.
          {isLoading && <span className="block mt-2">Processing...</span>}
          {error && <span className="block mt-2 text-red-500">{error}</span>}
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-full shadow-md transition-all duration-300"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
// // === FRONTEND: PaymentSuccess.jsx ===
// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Link, useLocation } from 'react-router-dom';

// const PaymentSuccess = () => {
//   const { t } = useTranslation();
//   const location = useLocation();
//   const [paymentStatus, setPaymentStatus] = useState('Pending');
//   const [error, setError] = useState('');
//   const txRef = new URLSearchParams(location.search).get('tx_ref');

//   useEffect(() => {
//     if (txRef) {
//       const fetchStatus = async () => {
//         try {
//           const response = await fetch(`http://localhost:5000/api/appointments/status-by-tx/${txRef}`);
//           const data = await response.json();
//           if (!response.ok || !data.payment_status) throw new Error(data.error || 'Failed to fetch status');
//           setPaymentStatus(data.payment_status);
//         } catch (err) {
//           console.error('Error fetching payment status:', err);
//           setError(t('payment.errorFetchingStatus'));
//         }
//       };
//       fetchStatus();
//     }
//   }, [txRef, t]);

//   return (
//     <div className="py-20 bg-gray-50 text-center">
//       <h1 className="text-4xl font-bold text-gray-800 mb-4">
//         {paymentStatus === 'Completed' ? t('payment.successTitle') : t('payment.pendingTitle')}
//       </h1>
//       <p className="text-lg text-gray-600 mb-8">
//         {paymentStatus === 'Completed'
//           ? t('payment.successMessage')
//           : paymentStatus === 'Failed'
//           ? t('payment.failedMessage')
//           : t('payment.pendingMessage')}
//       </p>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       <Link
//         to="/"
//         className="px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700"
//       >
//         {t('payment.backToHome')}
//       </Link>
//     </div>
//   );
// };

// export default PaymentSuccess;
import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sendAppointmentEmail = async () => {
      // Get appointment data from localStorage
      const appointmentDataStr = localStorage.getItem('appointmentData');
      
      if (!appointmentDataStr) {
        console.error("No appointment data found");
        return;
      }

      try {
        const appointmentData = JSON.parse(appointmentDataStr);
        setIsLoading(true);
        
        // Prepare email data
        const emailData = {
          name: appointmentData.name,
          email: appointmentData.email,
          phone: appointmentData.phone,
          appointmentDate: appointmentData.appointmentDate,
          appointmentTime: appointmentData.appointmentTime,
          serviceType: appointmentData.serviceType,
          department: appointmentData.selectedDepartment,
          services: appointmentData.selectedServices,
          otherServices: appointmentData.otherServicesText,
          totalAmount: appointmentData.totalAmount,
          txRef: appointmentData.txRef,
          type: 'appointment'
        };

        // Send email
        const response = await fetch(`${API_URL}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        if (!response.ok) {
          throw new Error('Failed to send confirmation email');
        }

        console.log("Appointment confirmation email sent successfully");
        
        // Clear the appointment data from localStorage after sending email
        localStorage.removeItem('appointmentData');
      } catch (err) {
        console.error("Error sending appointment email:", err);
        setError("Failed to send confirmation email. Please contact support.");
      } finally {
        setIsLoading(false);
      }
    };

    // Send email when component mounts
    sendAppointmentEmail();
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
          {isLoading && <span className="block mt-2">Sending confirmation email...</span>}
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

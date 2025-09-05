import React, { memo, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const PaymentRedirect = memo(() => {
  const { path } = useParams();
  const navigate = useNavigate();
  const { refreshUserData } = useContext(AppContext);

  useEffect(() => {
    if (path) {
      // Refresh user data and enrolled courses after payment
      refreshUserData();
      
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 2000); // Wait 2 seconds before redirecting

      return () => clearTimeout(timer);
    }
  }, [path, navigate, refreshUserData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-600 font-medium">Processing your payment...</p>
        <p className="text-sm text-gray-500 mt-2">Redirecting you shortly...</p>
      </div>
    </div>
  );
});

PaymentRedirect.displayName = 'PaymentRedirect';

export default PaymentRedirect;

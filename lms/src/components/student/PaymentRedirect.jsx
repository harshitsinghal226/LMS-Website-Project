import React, { memo, useEffect, useContext, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentRedirect = memo(() => {
  const { path } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUserData, backendUrl, getToken } = useContext(AppContext);
  const [isVerifying, setIsVerifying] = useState(true);

  const verifyPayment = async () => {
    try {
      const purchaseId = searchParams.get('purchaseId');
      if (!purchaseId) {
        toast.error("Purchase ID not found");
        return;
      }

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/verify-payment`,
        { purchaseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Payment verified successfully!");
        await refreshUserData();
      } else {
        toast.error(data.message || "Payment verification failed");
      }
    } catch (error) {
      toast.error("Payment verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (path) {
      verifyPayment();
      
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 3000); // Wait 3 seconds to allow verification

      return () => clearTimeout(timer);
    }
  }, [path, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-600 font-medium">
          {isVerifying ? "Verifying your payment..." : "Processing your payment..."}
        </p>
        <p className="text-sm text-gray-500 mt-2">Redirecting you shortly...</p>
      </div>
    </div>
  );
});

PaymentRedirect.displayName = 'PaymentRedirect';

export default PaymentRedirect;

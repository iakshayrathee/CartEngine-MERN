"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing payment verification...");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate progress for better UX
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 300);

    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      if (!orderId) {
        setError(
          "Order information not found. Please contact customer support."
        );
        clearInterval(interval);
        return;
      }

      setStatus("Verifying payment details...");

      setTimeout(() => {
        setStatus("Processing your payment...");

        setTimeout(() => {
          setStatus("Finalizing your order...");

          dispatch(capturePayment({ paymentId, payerId, orderId }))
            .then((data) => {
              if (data?.payload?.success) {
                sessionStorage.removeItem("currentOrderId");
                setStatus("Payment successful! Redirecting...");
                setTimeout(() => {
                  navigate("/shop/payment-success");
                }, 1000);
              } else {
                setError(
                  "Payment verification failed. Please contact customer support."
                );
                clearInterval(interval);
              }
            })
            .catch(() => {
              setError(
                "An error occurred while processing your payment. Please contact customer support."
              );
              clearInterval(interval);
            });
        }, 1500);
      }, 1500);
    } else {
      setError(
        "Payment information is missing. Please try again or contact customer support."
      );
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [paymentId, payerId, dispatch, navigate]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-primary h-3" />
          <CardHeader className="pt-8 pb-6 text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <CreditCard className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {error ? "Payment Processing Issue" : "Processing Your Payment"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-4">
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="text-center text-muted-foreground">
                      {status}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-center text-muted-foreground">
                    Please do not close this window or navigate away while your
                    payment is being processed.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PaypalReturnPage;

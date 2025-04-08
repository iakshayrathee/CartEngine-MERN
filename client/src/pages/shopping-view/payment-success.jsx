"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  // Confetti effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: [
                  "#FF5733",
                  "#33FF57",
                  "#3357FF",
                  "#F3FF33",
                  "#FF33F3",
                  "#33FFF3",
                ][Math.floor(Math.random() * 6)],
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ y: -10, opacity: 0 }}
              animate={{
                y: Math.random() * 1000,
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5],
              }}
              transition={{
                duration: 5,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3" />
          <CardHeader className="pt-8 pb-6 text-center">
            <div className="mx-auto bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Payment Successful!
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <p className="text-center text-muted-foreground">
              Thank you for your purchase. Your order has been successfully
              processed and is now being prepared for shipping.
            </p>

            <div className="bg-muted/30 rounded-lg p-4 flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your registered email
                  address.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate("/shop/account")}
                className="w-full py-6 text-base font-semibold"
                size="lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                View My Orders
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/shop/home")}
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default PaymentSuccessPage;

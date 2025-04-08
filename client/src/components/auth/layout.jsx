import { Outlet } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

function AuthLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
      {/* Left Section with Background Image */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[url('/images/authpage.jpeg')] bg-cover bg-center bg-no-repeat w-1/2 px-12 relative overflow-hidden">
        {/* Darker overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-white/10 p-4 rounded-full mb-8 backdrop-blur-md ring-1 ring-white/20 shadow-xl">
            <ShoppingBag className="h-12 w-12 text-white" />
          </div>
          <div className="max-w-md space-y-8 text-center text-white">
            <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
              Welcome to CartEngine
            </h1>
            <p className="text-lg text-white/90 drop-shadow-md leading-relaxed">
              Your one-stop destination for all your shopping needs. Browse our
              extensive collection of products and enjoy a seamless shopping
              experience.
            </p>
            <div className="pt-8 flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20">
                <div className="bg-white/20 p-3 rounded-full shadow-inner">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg drop-shadow-sm">
                    Wide Selection
                  </h3>
                  <p className="text-sm text-white/80 drop-shadow-sm">
                    Thousands of products to choose from
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20">
                <div className="bg-white/20 p-3 rounded-full shadow-inner">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg drop-shadow-sm">
                    Fast Delivery
                  </h3>
                  <p className="text-sm text-white/80 drop-shadow-sm">
                    Get your orders delivered quickly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20">
                <div className="bg-white/20 p-3 rounded-full shadow-inner">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg drop-shadow-sm">
                    Secure Payments
                  </h3>
                  <p className="text-sm text-white/80 drop-shadow-sm">
                    Your transactions are always protected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right Section with Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;

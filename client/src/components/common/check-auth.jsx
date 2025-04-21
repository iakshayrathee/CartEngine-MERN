import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "./loading-screen";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(true);

  useEffect(() => {
    // Set navigating to false after a short delay to show loading screen
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Show loading screen while navigating
  if (isNavigating) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

export default CheckAuth;

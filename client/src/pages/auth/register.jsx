"use client";

import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    dispatch(registerUser(formData)).then((data) => {
      setIsLoading(false);
      if (data?.payload?.success) {
        toast({
          title: "Registration successful",
          description: data?.payload?.message,
        });
        navigate("/auth/login");
      } else {
        setError(
          data?.payload?.message || "Registration failed. Please try again."
        );
        toast({
          title: "Registration failed",
          description: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-0 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-2 bg-primary/5 border-b px-6 py-5">
          <CardTitle className="text-2xl font-bold text-center tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground/90">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <CommonForm
            formControls={registerFormControls}
            buttonText={"Create Account"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </CardContent>

        <CardFooter className="flex flex-col items-center border-t px-6 py-5 bg-muted/5">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
              to="/auth/login"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground/80">
        <p>
          By creating an account, you agree to our Terms of Service and
          Privacy Policy
        </p>
        <p className="mt-1.5">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </div>
  );
}

export default AuthRegister;

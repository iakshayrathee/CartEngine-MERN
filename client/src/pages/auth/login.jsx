"use client";

import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    dispatch(loginUser(formData)).then((data) => {
      setIsLoading(false);
      if (data?.payload?.success) {
        toast({
          title: "Login successful",
          description: data?.payload?.message,
        });
      } else {
        toast({
          title: "Login failed",
          description:
            data?.payload?.message ||
            "Please check your credentials and try again",
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
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground/90">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <CommonForm
            formControls={loginFormControls}
            buttonText={"Sign In"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </CardContent>

        <CardFooter className="flex flex-col items-center border-t px-6 py-5 bg-muted/5">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
              to="/auth/register"
            >
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground/80">
        <p>Protected by industry standard encryption</p>
        <p className="mt-1.5">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </div>
  );
}

export default AuthLogin;

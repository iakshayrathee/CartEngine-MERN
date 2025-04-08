"use client";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function UnauthPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div className="text-center max-w-md">
        <div className="bg-red-100 p-6 rounded-full inline-flex mb-6">
          <Lock className="h-12 w-12 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You don't have permission to access this page.
          </AlertDescription>
        </Alert>

        <p className="text-lg text-muted-foreground mb-8">
          Please log in with appropriate credentials to view this content, or
          return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button
            onClick={() => navigate("/auth/login")}
            className="flex items-center gap-2"
          >
            <Lock className="h-4 w-4" />
            Sign In
          </Button>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
}

export default UnauthPage;

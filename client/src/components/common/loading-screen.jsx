import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Connecting to server...");

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);

    // Update loading text based on progress
    const textInterval = setInterval(() => {
      if (progress < 30) {
        setLoadingText("Connecting to server...");
      } else if (progress < 60) {
        setLoadingText("Verifying your credentials...");
      } else if (progress < 90) {
        setLoadingText("Loading your profile...");
      } else {
        setLoadingText("Almost ready!");
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [progress]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 w-80">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold text-gray-800">Loading...</h2>
        <p className="text-gray-500 text-center">{loadingText}</p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;

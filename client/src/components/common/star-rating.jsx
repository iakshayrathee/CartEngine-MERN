"use client";

import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function StarRatingComponent({
  rating,
  handleRatingChange,
  size = "default",
  readOnly = false,
  className,
}) {
  const sizeClasses = {
    small: {
      button: "p-1.5",
      icon: "w-3 h-3",
    },
    default: {
      button: "p-2.5",
      icon: "w-5 h-5",
    },
    large: {
      button: "p-3",
      icon: "w-6 h-6",
    },
  };

  const buttonSize = sizeClasses[size]?.button || sizeClasses.default.button;
  const iconSize = sizeClasses[size]?.icon || sizeClasses.default.icon;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          type="button"
          className={`
            ${buttonSize} rounded-full transition-all duration-300 
            ${!readOnly && "transform hover:scale-110"} 
            ${
              star <= rating
                ? "text-yellow-400 hover:text-yellow-500 bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
                : "text-gray-400 hover:text-yellow-400 bg-gray-50 hover:bg-yellow-50 border-gray-200"
            }
            ${readOnly ? "cursor-default" : "cursor-pointer"}
          `}
          variant="outline"
          size="icon"
          onClick={
            !readOnly && handleRatingChange
              ? () => handleRatingChange(star)
              : undefined
          }
          tabIndex={readOnly ? -1 : 0}
        >
          <StarIcon
            className={`
              ${iconSize} transition-colors duration-300 
              ${
                star <= rating
                  ? "fill-yellow-400 stroke-yellow-500"
                  : "fill-gray-100 stroke-gray-400"
              }
            `}
          />
          <span className="sr-only">
            {star} star{star !== 1 ? "s" : ""}
          </span>
        </Button>
      ))}
    </div>
  );
}

export default StarRatingComponent;

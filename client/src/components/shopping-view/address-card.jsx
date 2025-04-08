"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, MapPin, Phone, Trash2, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-300 hover:shadow-md overflow-hidden ${
        isSelected
          ? "border-primary border-2 shadow-lg ring-4 ring-primary/20"
          : "border-border hover:border-primary/30"
      }`}
    >
      {isSelected && <div className="bg-primary h-1.5 w-full" />}

      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-full ${
                isSelected
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <MapPin className="h-4 w-4" />
            </div>
            <h3 className="font-semibold">Delivery Address</h3>
          </div>

          {isSelected && (
            <Badge className="bg-primary text-white">Selected</Badge>
          )}
        </div>

        <div className="space-y-3 pl-1">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{addressInfo?.address}</p>
              <p className="text-sm text-muted-foreground">
                {addressInfo?.city}, {addressInfo?.pincode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{addressInfo?.phone}</span>
          </div>

          {addressInfo?.notes && (
            <>
              <Separator className="my-2" />
              <div className="text-sm text-muted-foreground italic">
                "{addressInfo?.notes}"
              </div>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;

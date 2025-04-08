"use client";

import { useState, useMemo } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  User,
  MapPin,
  Phone,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const initialFormData = {
  status: "pending",
};

const statusMap = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "bg-green-500" },
  inProcess: { label: "In Process", icon: RefreshCw, color: "bg-blue-500" },
  inShipping: { label: "In Shipping", icon: Truck, color: "bg-purple-500" },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "bg-emerald-500",
  },
  rejected: { label: "Rejected", icon: AlertCircle, color: "bg-red-500" },
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Memoize calculations to improve performance
  const orderSummary = useMemo(() => {
    const subtotal =
      orderDetails?.cartItems?.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ) || 0;
    const shipping = 40;
    const tax = subtotal * 0.05;
    const total = orderDetails?.totalAmount || 0;
    return { subtotal, shipping, tax, total };
  }, [orderDetails]);

  // Memoize status details
  const statusDetails = useMemo(() => {
    const currentStatus = orderDetails?.orderStatus || "pending";
    return {
      StatusIcon: statusMap[currentStatus]?.icon || Clock,
      statusColor: statusMap[currentStatus]?.color || "bg-gray-500",
      statusLabel: statusMap[currentStatus]?.label || "Unknown",
    };
  }, [orderDetails?.orderStatus]);

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  if (!orderDetails) return null;

  return (
    <DialogContent
      className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white border-none shadow-lg"
      overlayClassName="bg-transparent" // This makes the overlay transparent
    >
      <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl font-bold">Order Details</DialogTitle>
          <Badge
            className={`${statusDetails.statusColor} px-3 py-1 flex items-center gap-1`}
          >
            <statusDetails.StatusIcon className="h-4 w-4" />
            {statusDetails.statusLabel}
          </Badge>
        </div>
      </DialogHeader>

      <div className="grid gap-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Order Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-medium">{orderDetails._id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Date:
                  </span>
                  <span className="font-medium">
                    {new Date(orderDetails.orderDate).toLocaleDateString()} at{" "}
                    {new Date(orderDetails.orderDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" /> Payment:
                  </span>
                  <span className="font-medium capitalize">
                    {orderDetails.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge
                    variant={
                      orderDetails.paymentStatus === "paid"
                        ? "success"
                        : "outline"
                    }
                  >
                    {orderDetails.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Shipping Information</h3>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>{user.userName}</span>
                </div>
                <div className="text-muted-foreground">
                  {orderDetails?.addressInfo?.address}
                </div>
                <div className="text-muted-foreground">
                  {orderDetails?.addressInfo?.city},{" "}
                  {orderDetails?.addressInfo?.pincode}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{orderDetails?.addressInfo?.phone}</span>
                </div>
                {orderDetails?.addressInfo?.notes && (
                  <div className="flex items-center gap-1 text-muted-foreground mt-2">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="italic">
                      "{orderDetails?.addressInfo?.notes}"
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items">Order Items</TabsTrigger>
            <TabsTrigger value="update">Update Status</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4 mt-4">
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 font-medium text-sm grid grid-cols-12">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="divide-y">
                {orderDetails?.cartItems &&
                orderDetails?.cartItems.length > 0 ? (
                  orderDetails?.cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 grid grid-cols-12 items-center"
                    >
                      <div className="col-span-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground">
                            SKU: {item.productId?.substring(0, 8)}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        ${item.price.toLocaleString()}
                      </div>
                      <div className="col-span-2 text-center">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        ${(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No items in this order
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted/20 rounded-md p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${orderSummary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span>${orderSummary.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (5%):</span>
                  <span>${orderSummary.tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${orderSummary.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="update" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Current Status</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${statusDetails.statusColor} px-3 py-1 flex items-center gap-1`}
                      >
                        <statusDetails.StatusIcon className="h-4 w-4" />
                        {statusDetails.statusLabel}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Update Order Status</h3>
                    <CommonForm
                      formControls={[
                        {
                          label: "New Status",
                          name: "status",
                          componentType: "select",
                          options: [
                            { id: "pending", label: "Pending" },
                            { id: "inProcess", label: "In Process" },
                            { id: "inShipping", label: "In Shipping" },
                            { id: "delivered", label: "Delivered" },
                            { id: "confirmed", label: "Confirmed" },
                            { id: "rejected", label: "Rejected" },
                          ],
                        },
                      ]}
                      formData={formData}
                      setFormData={setFormData}
                      buttonText={"Update Status"}
                      onSubmit={handleUpdateStatus}
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Important Note</p>
                        <p className="mt-1">
                          Changing the order status will notify the customer via
                          email. Make sure you're updating to the correct status
                          as this action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;

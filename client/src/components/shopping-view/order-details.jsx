import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import {
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  if (!orderDetails) return null;

  // Get status color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "confirmed":
        return "bg-green-500 hover:bg-green-600";
      case "rejected":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Calculate order summary
  const subtotal =
    orderDetails?.cartItems?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;

  const shipping = 40; // Example shipping cost
  const tax = subtotal * 0.05; // Example tax rate (5%)
  const total = orderDetails?.totalAmount || 0;

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl font-bold">Order Details</DialogTitle>
          <Badge
            className={`${getStatusColor(orderDetails.orderStatus)} px-3 py-1`}
          >
            {orderDetails.orderStatus.charAt(0).toUpperCase() +
              orderDetails.orderStatus.slice(1)}
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
                  <div className="text-muted-foreground mt-2 italic">
                    "{orderDetails?.addressInfo?.notes}"
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items">Order Items</TabsTrigger>
            <TabsTrigger value="tracking">Order Tracking</TabsTrigger>
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
                          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
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
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span>${shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (5%):</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="mt-4">
            <div className="relative border-l-2 border-primary/30 ml-4 pl-6 py-2">
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute -left-[30px] top-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Package className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Order Placed</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(orderDetails.orderDate).toLocaleDateString()} at{" "}
                      {new Date(orderDetails.orderDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm mt-1">
                      Your order has been placed successfully.
                    </p>
                  </div>
                </div>

                {orderDetails.orderStatus !== "rejected" && (
                  <>
                    <div className="relative">
                      <div
                        className={`absolute -left-[30px] top-0 h-6 w-6 rounded-full ${
                          orderDetails.orderStatus !== "pending"
                            ? "bg-primary"
                            : "bg-muted"
                        } flex items-center justify-center`}
                      >
                        <CreditCard
                          className={`h-3 w-3 ${
                            orderDetails.orderStatus !== "pending"
                              ? "text-white"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Payment Confirmed</h4>
                        <p className="text-sm text-muted-foreground">
                          {orderDetails.paymentStatus === "paid"
                            ? `${new Date(
                                orderDetails.orderDate
                              ).toLocaleDateString()}`
                            : "Pending"}
                        </p>
                        <p className="text-sm mt-1">
                          {orderDetails.paymentStatus === "paid"
                            ? "Your payment has been confirmed."
                            : "Waiting for payment confirmation."}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <div
                        className={`absolute -left-[30px] top-0 h-6 w-6 rounded-full ${
                          orderDetails.orderStatus === "confirmed" ||
                          orderDetails.orderStatus === "delivered"
                            ? "bg-primary"
                            : "bg-muted"
                        } flex items-center justify-center`}
                      >
                        <Package
                          className={`h-3 w-3 ${
                            orderDetails.orderStatus === "confirmed" ||
                            orderDetails.orderStatus === "delivered"
                              ? "text-white"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Order Confirmed</h4>
                        <p className="text-sm text-muted-foreground">
                          {orderDetails.orderStatus === "confirmed" ||
                          orderDetails.orderStatus === "delivered"
                            ? "Processing"
                            : "Pending"}
                        </p>
                        <p className="text-sm mt-1">
                          {orderDetails.orderStatus === "confirmed" ||
                          orderDetails.orderStatus === "delivered"
                            ? "Your order has been confirmed and is being processed."
                            : "Waiting for order confirmation."}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <div
                        className={`absolute -left-[30px] top-0 h-6 w-6 rounded-full ${
                          orderDetails.orderStatus === "delivered"
                            ? "bg-primary"
                            : "bg-muted"
                        } flex items-center justify-center`}
                      >
                        <Truck
                          className={`h-3 w-3 ${
                            orderDetails.orderStatus === "delivered"
                              ? "text-white"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Delivered</h4>
                        <p className="text-sm text-muted-foreground">
                          {orderDetails.orderStatus === "delivered"
                            ? "Completed"
                            : "Pending"}
                        </p>
                        <p className="text-sm mt-1">
                          {orderDetails.orderStatus === "delivered"
                            ? "Your order has been delivered successfully."
                            : "Your order will be delivered soon."}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {orderDetails.orderStatus === "rejected" && (
                  <div className="relative">
                    <div className="absolute -left-[30px] top-0 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                      <Package className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-red-600">
                        Order Rejected
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          orderDetails.orderUpdateDate || orderDetails.orderDate
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-1">
                        Your order has been rejected. Please contact customer
                        support for more information.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;

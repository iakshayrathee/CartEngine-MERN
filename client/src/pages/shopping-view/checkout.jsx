import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CreditCard, ShoppingBag, Truck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            parseFloat(
              (
                (currentItem?.salePrice > 0
                  ? currentItem?.salePrice
                  : currentItem?.price) * currentItem?.quantity
              ).toFixed(2)
            ),
          0
        )
      : 0;

  // Calculate subtotal, shipping, and tax
  const subtotal = parseFloat(totalCartAmount.toFixed(2)); // Ensure 2 decimals
  const shipping = 40.0; // Fixed to 2 decimals
  const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% tax, 2 decimals
  const total = parseFloat((subtotal + shipping + tax).toFixed(2)); // Final total, 2 decimals
  // console.log(">>>total", total, typeof total); // Should log: >>>total 22537.30 number

  function handleInitiatePaypalPayment() {
    if (!cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });

      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price: parseFloat(
          (singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price
          ).toFixed(2)
        ),
        quantity: parseInt(singleCartItem?.quantity),
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: total,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
    // console.log(">>>orderData", orderData);

    dispatch(createNewOrder(orderData)).then((data) => {
      // console.log(">>>data", data);
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img || "/placeholder.svg"}
          className="h-full w-full object-cover object-center"
          alt="Checkout banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Checkout
          </h1>
          <p className="text-white/90 max-w-xl">
            Complete your purchase and get ready for delivery
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold mr-2">
            1
          </div>
          <h2 className="text-xl font-bold">Review and Complete Your Order</h2>
        </div>

        {(!cartItems.items || cartItems.items.length === 0) && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Your cart is empty</AlertTitle>
            <AlertDescription>
              Please add items to your cart before proceeding to checkout.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-primary mr-2" />
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Address
                  selectedId={currentSelectedAddress}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-primary mr-2" />
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                  <div className="space-y-6">
                    {cartItems.items.map((item, index) => (
                      <div key={item.productId}>
                        <UserCartItemsContent cartItem={item} />
                        {index < cartItems.items.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <h3 className="text-base font-medium">
                      Your cart is empty
                    </h3>
                    <p className="mt-1 text-sm">
                      Add items to your cart to proceed with checkout
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="lg:sticky lg:top-4">
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-primary mr-2" />
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (5%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <Button
                      onClick={handleInitiatePaypalPayment}
                      className="w-full mt-4 py-6 text-base"
                      disabled={
                        isPaymentStart ||
                        !cartItems.items ||
                        cartItems.items.length === 0 ||
                        !currentSelectedAddress
                      }
                    >
                      {isPaymentStart ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                          Processing Payment...
                        </>
                      ) : (
                        "Checkout with PayPal"
                      )}
                    </Button>

                    {!currentSelectedAddress && (
                      <p className="text-sm text-amber-600 mt-2">
                        Please select a shipping address to continue
                      </p>
                    )}

                    <div className="mt-4 text-xs text-muted-foreground">
                      <p>
                        By completing your purchase, you agree to our Terms of
                        Service and Privacy Policy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Secure Checkout</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your payment information is processed securely. We do not
                      store credit card details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;

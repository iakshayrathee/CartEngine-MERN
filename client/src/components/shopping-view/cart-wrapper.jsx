import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ArrowRight, Package, ShoppingBag, ShoppingCart } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // Calculate subtotal, shipping, and tax
  const subtotal = totalCartAmount;
  const shipping = cartItems && cartItems.length > 0 ? 40 : 0; // Example shipping cost
  const tax = subtotal * 0.05; // Example tax rate (5%)
  const total = subtotal + shipping + tax;

  // Calculate total items
  const totalItems =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
      : 0;

  return (
    <SheetContent className="flex flex-col sm:max-w-md p-0">
      <SheetHeader className="border-b p-4">
        <SheetTitle className="text-xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          Your Cart
          {totalItems > 0 && (
            <Badge variant="secondary" className="ml-2">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Badge>
          )}
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        {cartItems && cartItems.length > 0 ? (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <div className="bg-muted/30 p-6 rounded-full mb-4">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="font-medium text-lg">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Looks like you haven't added anything to your cart yet
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                navigate("/shop/listing");
                setOpenCartSheet(false);
              }}
            >
              Browse Products
            </Button>
          </div>
        )}
      </div>

      {cartItems && cartItems.length > 0 && (
        <div className="border-t p-4 bg-muted/5">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center font-bold text-lg pt-2">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                navigate("/shop/checkout");
                setOpenCartSheet(false);
              }}
              className="w-full py-6 text-base font-semibold group"
            >
              Checkout
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                navigate("/shop/listing");
                setOpenCartSheet(false);
              }}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>Free shipping on orders over $1000</span>
          </div>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;

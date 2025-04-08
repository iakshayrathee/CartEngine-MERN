import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { Badge } from "../ui/badge";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock =
          productList[getCurrentProductIndex]?.totalStock || 0;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  // Calculate discount percentage if applicable
  const originalPrice = cartItem?.price || 0;
  const salePrice = cartItem?.salePrice || 0;
  const discountPercentage =
    salePrice > 0
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-1 rounded-lg transition-colors hover:bg-muted/30">
      <div className="relative w-full sm:w-20 h-20 rounded-md overflow-hidden bg-muted/30">
        <img
          src={cartItem?.image || "/placeholder.svg"}
          alt={cartItem?.title}
          className="w-full h-full object-cover"
        />
        {discountPercentage > 0 && (
          <Badge className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
            {discountPercentage}% OFF
          </Badge>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base line-clamp-1">{cartItem?.title}</h3>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span>SKU: {cartItem?.productId?.substring(0, 8)}</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-3 h-3" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span className="font-medium w-6 text-center">
              {cartItem?.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => handleCartItemDelete(cartItem)}
          >
            <Trash className="w-4 h-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 min-w-[80px]">
        {salePrice > 0 ? (
          <>
            <span className="text-sm line-through text-muted-foreground">
              ${originalPrice.toFixed(2)}
            </span>
            <span className="font-bold text-primary">
              ${salePrice.toFixed(2)}
            </span>
          </>
        ) : (
          <span className="font-bold">${originalPrice.toFixed(2)}</span>
        )}
        <span className="text-sm text-muted-foreground">
          Total: $
          {(
            (salePrice > 0 ? salePrice : originalPrice) * cartItem?.quantity
          ).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default UserCartItemsContent;

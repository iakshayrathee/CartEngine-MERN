"use client";

import {
  StarIcon,
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  // Remove productImages array and activeImageIndex state
  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (quantity <= 0 || quantity > getTotalStock) {
      toast({
        title: `Please select a valid quantity (1-${getTotalStock})`,
        variant: "destructive",
      });
      return;
    }

    const getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const currentQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (currentQuantity + quantity > getTotalStock) {
          toast({
            title: `Only ${
              getTotalStock - currentQuantity
            } more can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: quantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: `${quantity} item${quantity > 1 ? "s" : ""} added to cart`,
          description: "You can checkout or continue shopping",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setQuantity(1);
  }

  function handleAddReview() {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  function handleQuantityChange(value) {
    const newQuantity = Math.max(
      1,
      Math.min(productDetails?.totalStock || 10, value)
    );
    setQuantity(newQuantity);
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  // Calculate discount percentage
  const discountPercentage =
    productDetails?.salePrice > 0
      ? Math.round(
          ((productDetails.price - productDetails.salePrice) /
            productDetails.price) *
            100
        )
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-8 max-w-[95vw] sm:max-w-[85vw] lg:max-w-[75vw] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl shadow-lg group h-fit bg-accent/5">
            <div className="aspect-square relative">
              <img
                src={productDetails?.image || "/placeholder.svg"}
                alt={productDetails?.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {discountPercentage > 0 && (
                <Badge className="absolute top-3 right-3 bg-primary text-white font-bold px-2 py-1">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Product features */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-3 bg-accent/5 rounded-xl">
              <Truck className="h-5 w-5 text-primary mb-2" />
              <span className="text-xs text-center font-medium">
                Free Shipping
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-accent/5 rounded-xl">
              <Shield className="h-5 w-5 text-primary mb-2" />
              <span className="text-xs text-center font-medium">Warranty</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-accent/5 rounded-xl">
              <RotateCcw className="h-5 w-5 text-primary mb-2" />
              <span className="text-xs text-center font-medium">
                30-Day Returns
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({reviews?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-extrabold">
                    {productDetails?.title}
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <StarRatingComponent rating={averageReview} />
                  </div>
                  <span className="text-muted-foreground font-medium text-sm">
                    ({averageReview.toFixed(1)}) · {reviews?.length || 0}{" "}
                    reviews
                  </span>
                </div>

                <p className="text-muted-foreground text-base leading-relaxed mb-6">
                  {productDetails?.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-accent/10 p-4 rounded-xl">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <div className="flex items-end gap-2">
                      <p
                        className={`text-2xl font-bold ${
                          productDetails?.salePrice > 0
                            ? "line-through text-muted-foreground"
                            : "text-primary"
                        }`}
                      >
                        ${productDetails?.price}
                      </p>
                      {productDetails?.salePrice > 0 ? (
                        <p className="text-2xl font-bold text-primary animate-in slide-in-from-right-1">
                          ${productDetails?.salePrice}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-600 border-green-200"
                  >
                    In Stock: {productDetails?.totalStock}
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          Number.parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 h-10 text-center border-0"
                      min="1"
                      max={productDetails?.totalStock}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= productDetails?.totalStock}
                    >
                      +
                    </Button>
                  </div>

                  <div className="flex-1">
                    {productDetails?.totalStock === 0 ? (
                      <Button
                        className="w-full opacity-60 cursor-not-allowed bg-destructive/80 hover:bg-destructive/80"
                        disabled
                      >
                        Out of Stock
                      </Button>
                    ) : (
                      <Button
                        className="w-full text-base py-6 transition-all duration-300 hover:scale-[1.02] group"
                        onClick={() =>
                          handleAddToCart(
                            productDetails?._id,
                            productDetails?.totalStock
                          )
                        }
                      >
                        <ShoppingCart className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Category</p>
                  <p className="text-muted-foreground">
                    {productDetails?.category}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Brand</p>
                  <p className="text-muted-foreground">
                    {productDetails?.brand}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div className="grid gap-4">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((reviewItem, index) => (
                      <div
                        key={index}
                        className="flex gap-3 bg-accent/5 p-4 rounded-xl transition-colors hover:bg-accent/10"
                      >
                        <Avatar className="w-10 h-10 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {reviewItem?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base">
                              {reviewItem?.userName}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1">
                            <StarRatingComponent
                              rating={reviewItem?.reviewValue}
                            />
                            <span className="text-xs text-muted-foreground ml-1">
                              {new Date().toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                            {reviewItem.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <StarIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <h3 className="text-base font-medium">No Reviews Yet</h3>
                      <p className="mt-1 text-sm">
                        Be the first to review this product
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 p-5 bg-accent/5 rounded-xl space-y-4">
                  <Label className="text-base font-semibold">
                    Write a Review
                  </Label>
                  <div className="flex gap-2 items-center">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                    <span className="text-sm text-muted-foreground">
                      {rating > 0
                        ? `${rating} out of 5 stars`
                        : "Select rating"}
                    </span>
                  </div>
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="py-5"
                  />
                  <Button
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === ""}
                    className="w-full transition-all duration-300 hover:scale-[1.02]"
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;

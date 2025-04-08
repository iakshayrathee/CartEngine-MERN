"use client";

import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Loader2, Search, ShoppingBag, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  // Initialize keyword from URL params
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    if (urlKeyword) {
      setKeyword(urlKeyword);
    }
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword)).then(() => {
          setIsSearching(false);
        });
      }, 500);

      return () => clearTimeout(timer);
    } else if (keyword === "") {
      setSearchParams(new URLSearchParams(``));
      dispatch(resetSearchResults());
      setIsSearching(false);
    }
  }, [keyword, dispatch]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
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
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to cart",
          description: "Item has been added to your cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  function handleClearSearch() {
    setKeyword("");
    setSearchParams(new URLSearchParams(``));
    dispatch(resetSearchResults());
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Search Products</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="pl-10 py-6 pr-10 text-lg focus-visible:ring-primary"
            placeholder="Search for products..."
          />
          {keyword && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {keyword && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {isSearching ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </span>
            ) : searchResults.length > 0 ? (
              `Found ${searchResults.length} results for "${keyword}"`
            ) : (
              `No results found for "${keyword}"`
            )}
          </p>
        )}
      </div>

      <Separator className="my-6" />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Searching for products...</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((item) => (
            <div
              key={item._id}
              className="transform transition-all duration-300 hover:-translate-y-1"
            >
              <ShoppingProductTile
                handleAddtoCart={handleAddtoCart}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
              />
            </div>
          ))}
        </div>
      ) : keyword ? (
        <Card className="max-w-md mx-auto border-0 shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-muted/30 p-6 rounded-full mb-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any products matching your search. Try using
              different keywords or browse our categories.
            </p>
            <Button
              onClick={() => {
                setKeyword("");
                dispatch(resetSearchResults());
              }}
              variant="outline"
            >
              Clear Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-md mx-auto border-0 shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-4">
              <Search className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Search for products</h2>
            <p className="text-muted-foreground mb-6">
              Enter keywords in the search box above to find products
            </p>
          </CardContent>
        </Card>
      )}

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;

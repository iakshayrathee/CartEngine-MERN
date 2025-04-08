import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { ShoppingCart, Eye } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden group border border-border/40 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative overflow-hidden">
          <img
            src={product?.image || "/placeholder.svg"}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                handleGetProductDetails(product?._id);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {product?.title}
            </h2>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground px-2 py-0.5 bg-primary/5 rounded-full">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-sm text-muted-foreground px-2 py-0.5 bg-primary/5 rounded-full">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-end gap-2">
              <span
                className={`${
                  product?.salePrice > 0
                    ? "line-through text-muted-foreground text-sm"
                    : "text-lg font-semibold text-primary"
                }`}
              >
                ${product?.price}
              </span>
              {product?.salePrice > 0 ? (
                <span className="text-lg font-semibold text-primary">
                  ${product?.salePrice}
                </span>
              ) : null}
            </div>
            {product?.salePrice > 0 && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-600 border-green-200"
              >
                {Math.round(
                  ((product.price - product.salePrice) / product.price) * 100
                )}
                % OFF
              </Badge>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed" disabled>
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full group-hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;

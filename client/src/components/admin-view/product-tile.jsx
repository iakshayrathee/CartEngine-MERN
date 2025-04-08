"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Pencil, Star, Tag, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
  viewMode = "grid",
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate discount percentage if applicable
  const discountPercentage =
    product?.salePrice > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  if (viewMode === "list") {
    return (
      <Card
        className="w-full overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-48 h-48 overflow-hidden bg-muted/20">
            <img
              src={product?.image || "/placeholder.svg"}
              alt={product?.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product?.totalStock <= 5 && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                Low Stock: {product?.totalStock}
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          <div className="flex-1 flex flex-col p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors duration-300">
                  {product?.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-primary border-primary/20"
                  >
                    {product?.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground"
                  >
                    {product?.brand}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium">
                  {product?.averageReview || 0}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
              {product?.description || "No description available"}
            </p>

            <div className="mt-auto pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
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
                  {product?.salePrice > 0 && (
                    <span className="text-lg font-semibold text-primary">
                      ${product?.salePrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    setOpenCreateProductsDialog(true);
                    setCurrentEditedId(product?._id);
                    setFormData(product);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleDelete(product?._id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="w-full max-w-sm mx-auto overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <div className="relative overflow-hidden">
          <img
            src={product?.image || "/placeholder.svg"}
            alt={product?.title}
            className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 ${
              isHovered ? "opacity-100" : ""
            } transition-opacity duration-300 flex items-end justify-center pb-4`}
          >
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product?._id);
                setFormData(product);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick Edit
            </Button>
          </div>

          {product?.totalStock <= 5 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Low Stock: {product?.totalStock}
            </Badge>
          )}

          {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {product?.title}
            </h2>
            <div className="flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-full">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium">
                {product?.averageReview || 0}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground px-2 py-0.5 bg-primary/5 rounded-full">
              {product?.category}
            </span>
            <span className="text-sm text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
              {product?.brand}
            </span>
          </div>

          <Separator className="my-3" />

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
              {product?.salePrice > 0 && (
                <span className="text-lg font-semibold text-primary">
                  ${product?.salePrice}
                </span>
              )}
            </div>
            <Badge variant="outline" className="bg-muted/50">
              Stock: {product?.totalStock}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-1"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-1"
            onClick={() => handleDelete(product?._id)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;

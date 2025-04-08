"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import {
  AlertCircle,
  Calendar,
  Clock,
  Eye,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
} from "lucide-react";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails, loading } = useSelector(
    (state) => state.shopOrder
  );

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  // Filter orders based on search term
  const filteredOrders =
    orderList && orderList.length > 0
      ? orderList.filter((order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  // Get status icon based on order status
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "confirmed":
        return <Package className="h-4 w-4 mr-1" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

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

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border-b">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Order History
        </CardTitle>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 pt-4 border-b">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            </TabsList>
          </div>

          {["all", "pending", "confirmed"].map((tab) => (
            <TabsContent key={tab} value={tab} className="m-0">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading orders...</span>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Package className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No orders found
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {searchTerm
                      ? "No orders match your search criteria. Try a different search term."
                      : "You haven't placed any orders yet. Start shopping to see your orders here."}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[100px]">Order ID</TableHead>
                        <TableHead className="w-[150px]">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Order Date
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders
                        .filter(
                          (order) => tab === "all" || order.orderStatus === tab
                        )
                        .map((orderItem) => (
                          <TableRow
                            key={orderItem._id}
                            className="group hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <span className="text-xs text-muted-foreground">
                                #
                              </span>
                              {orderItem._id.substring(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>
                                  {new Date(
                                    orderItem.orderDate
                                  ).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    orderItem.orderDate
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`py-1 px-2 flex w-fit items-center ${getStatusColor(
                                  orderItem.orderStatus
                                )}`}
                              >
                                {getStatusIcon(orderItem.orderStatus)}
                                {orderItem.orderStatus.charAt(0).toUpperCase() +
                                  orderItem.orderStatus.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${orderItem.totalAmount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog
                                open={openDetailsDialog}
                                onOpenChange={() => {
                                  setOpenDetailsDialog(false);
                                  dispatch(resetOrderDetails());
                                }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleFetchOrderDetails(orderItem._id)
                                  }
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Details
                                </Button>
                                <ShoppingOrderDetailsView
                                  orderDetails={orderDetails}
                                />
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;

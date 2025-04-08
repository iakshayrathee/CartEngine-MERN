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
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Package,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const { orderList, orderDetails, loading } = useSelector(
    (state) => state.adminOrder
  );
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  // Filter and sort orders
  const filteredOrders =
    orderList && orderList.length > 0
      ? orderList
          .filter((order) => {
            // Status filter
            if (statusFilter !== "all" && order.orderStatus !== statusFilter) {
              return false;
            }

            // Search filter
            if (
              searchTerm &&
              !order._id.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return false;
            }

            return true;
          })
          .sort((a, b) => {
            // Sort by date
            const dateA = new Date(a.orderDate);
            const dateB = new Date(b.orderDate);

            if (sortOrder === "newest") {
              return dateB - dateA;
            } else {
              return dateA - dateB;
            }
          })
      : [];

  // Get status icon based on order status
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4 mr-1" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case "inProcess":
        return <RefreshCw className="h-4 w-4 mr-1" />;
      case "inShipping":
        return <Package className="h-4 w-4 mr-1" />;
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 mr-1" />;
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
      case "inProcess":
        return "bg-blue-500 hover:bg-blue-600";
      case "inShipping":
        return "bg-purple-500 hover:bg-purple-600";
      case "delivered":
        return "bg-emerald-500 hover:bg-emerald-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-white border-b rounded-t-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Order Management
              </h1>
              <div className="text-sm text-muted-foreground mt-1">
                View and manage customer orders across your store.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-row gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Filter className="h-4 w-4 mr-1" />
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuRadioGroup
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <DropdownMenuRadioItem value="all">
                        All Orders
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="pending">
                        Pending
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="confirmed">
                        Confirmed
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="inProcess">
                        In Process
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="inShipping">
                        In Shipping
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="delivered">
                        Delivered
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="rejected">
                        Rejected
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <ArrowUpDown className="h-4 w-4 mr-1" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuRadioGroup
                      value={sortOrder}
                      onValueChange={setSortOrder}
                    >
                      <DropdownMenuRadioItem value="newest">
                        Newest First
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="oldest">
                        Oldest First
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 max-h-[calc(100vh-16rem)] overflow-auto">
          <Tabs defaultValue="all" className="w-full flex flex-col h-full">
            <div className="px-6 pt-4 border-b sticky top-0 bg-white z-10">
              <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="inProcess">In Process</TabsTrigger>
                <TabsTrigger value="inShipping">Shipping</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </div>

            {[
              "all",
              "pending",
              "confirmed",
              "inProcess",
              "inShipping",
              "delivered",
              "rejected",
            ].map((tab) => (
              <TabsContent
                key={tab}
                value={tab}
                className="m-0 flex-1 overflow-auto"
              >
                <div className="rounded-md border-0">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
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
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-6 w-6 animate-spin text-primary mr-2" />
                              <span>Loading orders...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Package className="h-8 w-8 mb-2" />
                              <p>No orders found</p>
                              <p className="text-sm">
                                Try adjusting your filters
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders
                          .filter(
                            (order) =>
                              tab === "all" || order.orderStatus === tab
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
                                  {orderItem.orderStatus
                                    .charAt(0)
                                    .toUpperCase() +
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
                                    View Details
                                  </Button>
                                  <AdminOrderDetailsView
                                    orderDetails={orderDetails}
                                  />
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminOrdersView;

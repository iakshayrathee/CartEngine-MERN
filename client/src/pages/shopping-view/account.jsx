import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { Package, MapPin, User, Mail, Calendar } from "lucide-react";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg || "/placeholder.svg"}
          className="h-full w-full object-cover object-center"
          alt="Account banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            My Account
          </h1>
          <p className="text-white/90 max-w-xl">
            Manage your orders and addresses
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md overflow-hidden sticky top-4">
              <div className="bg-primary/5 p-6 border-b flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h2 className="font-bold text-xl">{user?.userName}</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {user?.email}
                </p>
              </div>

              <CardContent className="p-0">
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Member since {new Date().getFullYear()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-0 shadow-md overflow-hidden">
              <Tabs defaultValue="orders" className="w-full">
                <div className="border-b bg-white">
                  <TabsList className="w-full justify-start p-0 h-auto bg-transparent border-b-0">
                    <TabsTrigger
                      value="orders"
                      className="flex items-center gap-2 px-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      <Package className="h-4 w-4" />
                      Orders
                    </TabsTrigger>
                    <TabsTrigger
                      value="address"
                      className="flex items-center gap-2 px-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      <MapPin className="h-4 w-4" />
                      Addresses
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="orders" className="m-0 p-0">
                  <ShoppingOrders />
                </TabsContent>

                <TabsContent value="address" className="m-0 p-0">
                  <div className="p-6">
                    <Address />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;

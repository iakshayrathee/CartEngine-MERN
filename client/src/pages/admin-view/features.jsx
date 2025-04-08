import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Gift,
  Globe,
  Lock,
  Mail,
  MessageSquare,
  Settings,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function AdminFeatures() {
  // Mock data for features
  const features = [
    {
      id: "payments",
      title: "Payment Methods",
      description: "Configure payment gateways and options for your store",
      icon: <CreditCard className="h-5 w-5" />,
      status: "active",
      options: [
        { id: "credit-card", name: "Credit Card", enabled: true },
        { id: "paypal", name: "PayPal", enabled: true },
        { id: "apple-pay", name: "Apple Pay", enabled: false },
        { id: "google-pay", name: "Google Pay", enabled: false },
      ],
    },
    {
      id: "shipping",
      title: "Shipping Options",
      description: "Set up shipping methods and delivery options",
      icon: <Truck className="h-5 w-5" />,
      status: "active",
      options: [
        { id: "standard", name: "Standard Shipping", enabled: true },
        { id: "express", name: "Express Shipping", enabled: true },
        { id: "free", name: "Free Shipping", enabled: true },
        { id: "local", name: "Local Pickup", enabled: false },
      ],
    },
    {
      id: "discounts",
      title: "Discounts & Promotions",
      description: "Create and manage promotional offers",
      icon: <Gift className="h-5 w-5" />,
      status: "active",
      options: [
        { id: "coupons", name: "Coupon Codes", enabled: true },
        { id: "bulk", name: "Bulk Discounts", enabled: false },
        { id: "seasonal", name: "Seasonal Promotions", enabled: true },
        { id: "loyalty", name: "Loyalty Program", enabled: false },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configure email and SMS notifications",
      icon: <Mail className="h-5 w-5" />,
      status: "inactive",
      options: [
        { id: "order-confirm", name: "Order Confirmations", enabled: true },
        { id: "shipping", name: "Shipping Updates", enabled: true },
        { id: "abandoned", name: "Abandoned Cart", enabled: false },
        { id: "marketing", name: "Marketing Emails", enabled: false },
      ],
    },
    {
      id: "security",
      title: "Security Settings",
      description: "Configure security options for your store",
      icon: <ShieldCheck className="h-5 w-5" />,
      status: "active",
      options: [
        { id: "2fa", name: "Two-Factor Authentication", enabled: true },
        { id: "fraud", name: "Fraud Detection", enabled: true },
        { id: "ip", name: "IP Blocking", enabled: false },
        { id: "captcha", name: "CAPTCHA Protection", enabled: true },
      ],
    },
    {
      id: "international",
      title: "International Settings",
      description: "Configure language and currency options",
      icon: <Globe className="h-5 w-5" />,
      status: "inactive",
      options: [
        { id: "multi-currency", name: "Multiple Currencies", enabled: false },
        { id: "multi-language", name: "Multiple Languages", enabled: false },
        { id: "tax", name: "International Tax Compliance", enabled: false },
        { id: "geo", name: "Geolocation Services", enabled: false },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store Features</h1>
          <p className="text-muted-foreground">
            Configure and manage features for your online store.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Advanced Settings
        </Button>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertTitle>Feature Management</AlertTitle>
        <AlertDescription>
          Enable or disable features to customize your store's functionality.
          Some features may require additional configuration.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All Features</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features
              .filter((f) => f.status === "active")
              .map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features
              .filter((f) => f.status === "inactive")
              .map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Premium Features
          </CardTitle>
          <CardDescription>
            Upgrade your store with these premium features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-primary/5 transition-colors">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Live Chat Support</h3>
                  <Badge
                    variant="outline"
                    className="text-amber-600 bg-amber-50 border-amber-200"
                  >
                    Premium
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Provide real-time support to your customers with live chat
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-primary/5 transition-colors">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Advanced Security</h3>
                  <Badge
                    variant="outline"
                    className="text-amber-600 bg-amber-50 border-amber-200"
                  >
                    Premium
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Enhanced security features to protect your store and customers
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Upgrade to Premium</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function FeatureCard({ feature }) {
  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-full ${
                feature.status === "active"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {feature.icon}
            </div>
            <CardTitle className="text-lg">{feature.title}</CardTitle>
          </div>
          <Badge
            variant={feature.status === "active" ? "success" : "secondary"}
          >
            {feature.status === "active" ? (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Active
              </span>
            ) : (
              "Inactive"
            )}
          </Badge>
        </div>
        <CardDescription>{feature.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {feature.options.map((option) => (
            <div key={option.id} className="flex items-center justify-between">
              <Label
                htmlFor={option.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span>{option.name}</span>
                {option.enabled && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-50 text-green-600 border-green-200"
                  >
                    Enabled
                  </Badge>
                )}
              </Label>
              <Switch id={option.id} checked={option.enabled} />
            </div>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between p-4">
        <Button variant="outline" size="sm">
          Configure
        </Button>
        <Button
          variant={feature.status === "active" ? "destructive" : "default"}
          size="sm"
        >
          {feature.status === "active" ? "Disable" : "Enable"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminFeatures;

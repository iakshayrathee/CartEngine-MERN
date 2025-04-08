import {
  BarChartIcon as ChartNoAxesCombined,
  Home,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBasket,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket className="h-5 w-5" />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <Package className="h-5 w-5" />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("dashboard");

  useEffect(() => {
    // Set active item based on current path
    const path = location.pathname;
    const currentItem = adminSidebarMenuItems.find((item) =>
      path.includes(item.path)
    );
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [location.pathname]);

  return (
    <nav className="mt-6 flex-col flex gap-1.5">
      {adminSidebarMenuItems.map((menuItem) => (
        <Button
          key={menuItem.id}
          variant="ghost"
          onClick={() => {
            navigate(menuItem.path);
            setActiveItem(menuItem.id);
            setOpen ? setOpen(false) : null;
          }}
          className={cn(
            "flex w-full cursor-pointer items-center justify-start gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            activeItem === menuItem.id
              ? "bg-primary/10 text-primary hover:bg-primary/15"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
          {activeItem === menuItem.id && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></span>
          )}
        </Button>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0" data-sidebar="sidebar">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-md">
                  <ChartNoAxesCombined className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-auto p-4">
              <MenuItems setOpen={setOpen} />
            </div>
            <div className="border-t p-4" />
          </div>
        </SheetContent>
      </Sheet>

      <aside
        className="hidden w-64 flex-col border-r bg-background lg:flex"
        data-sidebar="sidebar"
      >
        <div className="flex h-16 items-center border-b px-6">
          <div
            onClick={() => navigate("/admin/dashboard")}
            className="flex cursor-pointer items-center gap-2 transition-transform hover:scale-[1.01]"
          >
            <div className="bg-primary/10 p-1.5 rounded-md">
              <ChartNoAxesCombined className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <MenuItems />
        </div>
        <div className="border-t p-6" />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;

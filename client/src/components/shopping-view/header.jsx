"use client";

import {
  PlugIcon as HousePlug,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeItem, setActiveItem] = useState("home");

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    setActiveItem(getCurrentMenuItem.id);

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  useEffect(() => {
    // Set active item based on current path
    const path = location.pathname;
    const currentItem = shoppingViewHeaderMenuItems.find((item) =>
      path.includes(item.path.replace("/", ""))
    );
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [location.pathname]);

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          className="relative"
          onClick={() => handleNavigate(menuItem)}
        >
          <Label
            className={`text-sm font-medium cursor-pointer transition-colors relative group ${
              activeItem === menuItem.id
                ? "text-primary"
                : "hover:text-primary/80"
            }`}
          >
            {menuItem.label}
            <span
              className={`absolute left-0 bottom-0 w-full h-0.5 bg-primary transform ${
                activeItem === menuItem.id
                  ? "scale-x-100"
                  : "scale-x-0 group-hover:scale-x-100"
              } transition-transform duration-200`}
            />
          </Label>
        </div>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {/* Search toggle for mobile */}
      <div className="relative lg:w-auto w-full order-1 lg:order-none">
        {showSearch ? (
          <div className="flex items-center relative animate-in slide-in-from-top-5 fade-in-0 duration-200">
            <Input
              placeholder="Search products..."
              className="pr-8 focus-visible:ring-primary"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0"
              onClick={() => setShowSearch(false)}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent transition-colors"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        )}
      </div>

      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItems?.items?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-in fade-in zoom-in">
                {cartItems?.items?.length}
              </span>
            )}
            <span className="sr-only">User cart</span>
          </Button>
        </SheetTrigger>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 relative"
          >
            <Avatar className="h-9 w-9 transition-all duration-300 hover:ring-2 hover:ring-primary/20">
              <AvatarFallback className="bg-primary text-white font-extrabold">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          className="w-56 animate-in fade-in-80 zoom-in-95 p-2"
        >
          <DropdownMenuLabel className="font-semibold px-2 py-1.5">
            <div className="flex flex-col">
              <span>Hello, {user?.userName}</span>
              <span className="text-xs font-normal text-muted-foreground mt-1">
                {user?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer hover:bg-accent transition-colors rounded-md px-2 py-1.5 flex items-center"
          >
            <UserCog className="mr-2 h-4 w-4" />
            My Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer hover:bg-destructive/10 transition-colors text-destructive rounded-md px-2 py-1.5 flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <Link
            to="/shop/home"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="bg-primary/10 p-1.5 rounded-md">
              <HousePlug className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg">CartEngine</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:block">
            <MenuItems />
          </div>

          {/* Desktop right content */}
          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-xs border-r shadow-lg p-6"
            >
              <div className="flex flex-col h-full">
                <Link to="/shop/home" className="flex items-center gap-2 mb-6">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <HousePlug className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-lg">CartEngine</span>
                </Link>
                <div className="space-y-6 flex-1">
                  <MenuItems />
                </div>
                <div className="pt-6 border-t">
                  <HeaderRightContent />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;

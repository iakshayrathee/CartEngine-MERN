import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-background border-b px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-primary/10"
        >
          <AlignJustify className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="hidden md:flex items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Admin Dashboard
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 relative"
            >
              <Avatar className="h-8 w-8 transition-all duration-300 hover:ring-2 hover:ring-primary/20">
                <AvatarFallback className="bg-primary text-white font-extrabold">
                  {user?.userName ? user.userName[0].toUpperCase() : "A"}
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
                <span>Hello, {user?.userName || "Admin"}</span>
                <span className="text-xs font-normal text-muted-foreground mt-1">
                  {user?.email || "admin@example.com"}
                </span>
              </div>
            </DropdownMenuLabel>
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
    </header>
  );
}

export default AdminHeader;

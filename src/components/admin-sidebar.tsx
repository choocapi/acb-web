"use client";

import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Home, LogOut, Package, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Trang quản trị",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Thêm sản phẩm",
    href: "/admin/add-product",
    icon: Plus,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="bg-background flex h-full w-64 flex-col border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <span className="text-xl font-bold">ACB Computer</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="space-y-2 border-t p-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Theme</span>
          <ModeToggle />
        </div>
        <Link href="/">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Quay lại trang chủ
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start"
          size="sm"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}

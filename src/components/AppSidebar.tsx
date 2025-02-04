import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  FileText,
  Home,
  Menu,
  Users,
  Wallet,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function AppSidebar({ className, children }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const routes = [
    {
      label: "Home",
      icon: Home,
      href: "/",
      color: "text-sky-500",
    },
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Cooperados",
      icon: Users,
      href: "/cooperados",
      color: "text-violet-500",
    },
    {
      label: "Usinas",
      icon: Building2,
      href: "/usinas",
      color: "text-pink-700",
      subItems: [
        {
          label: "Investidores",
          icon: User,
          href: "/usinas/investidores",
          color: "text-pink-700",
        },
      ],
    },
    {
      label: "Unidades de Usina",
      icon: Building2,
      href: "/unidades-usina",
      color: "text-orange-700",
    },
    {
      label: "Faturas",
      icon: FileText,
      href: "/faturas",
      color: "text-violet-500",
    },
    {
      label: "Pagamentos",
      icon: Wallet,
      href: "/pagamentos",
      color: "text-green-500",
    },
  ];

  const onClose = () => {
    setOpen(false);
  };

  const sidebar = (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <div key={route.href}>
                <Link
                  to={route.href}
                  onClick={onClose}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.href === location.pathname
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Button
                    variant={
                      route.href === location.pathname ? "secondary" : "ghost"
                    }
                    className="w-full justify-start"
                  >
                    <route.icon className={cn("mr-2 h-4 w-4", route.color)} />
                    {route.label}
                  </Button>
                </Link>
                {route.subItems?.map((subItem) => (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    onClick={onClose}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary ml-6 block",
                      subItem.href === location.pathname
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    <Button
                      variant={
                        subItem.href === location.pathname ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                    >
                      <subItem.icon
                        className={cn("mr-2 h-4 w-4", subItem.color)}
                      />
                      {subItem.label}
                    </Button>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <div className="flex">
        <div className="hidden w-[200px] flex-col md:flex">
          <ScrollArea className="flex-1">{sidebar}</ScrollArea>
        </div>
        <main className="flex-1 p-8 pt-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="ml-2 mt-2">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col">{sidebar}</nav>
        </SheetContent>
      </Sheet>
      <main className="flex-1 p-8 pt-6">{children}</main>
    </div>
  );
}
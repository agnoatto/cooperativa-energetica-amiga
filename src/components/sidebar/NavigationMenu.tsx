
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import { routes } from "@/config/routes";

interface NavigationMenuProps {
  onClose?: () => void;
}

export function NavigationMenu({ onClose }: NavigationMenuProps) {
  const location = useLocation();

  return (
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
  );
}

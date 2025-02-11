
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import { routes } from "@/config/routes";
import { ChevronLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { useSidebar } from "../ui/sidebar";

interface NavigationMenuProps {
  onClose?: () => void;
}

export function NavigationMenu({ onClose }: NavigationMenuProps) {
  const location = useLocation();
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  return (
    <div className="flex flex-col h-full">
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-9 p-0 m-2 ml-auto"
        onClick={() => {
          if (sidebarState === "open") {
            document.documentElement.style.setProperty("--sidebar-width", "4rem");
          } else {
            document.documentElement.style.setProperty("--sidebar-width", "16rem");
          }
        }}
      >
        <ChevronLeft className={cn(
          "h-4 w-4 transition-transform duration-200",
          isCollapsed && "rotate-180"
        )} />
        <span className="sr-only">
          {isCollapsed ? "Expandir menu" : "Recolher menu"}
        </span>
      </Button>

      <div className="space-y-4 py-4">
        {routes.map((section, idx) => (
          <div key={section.label} className="px-3 py-2">
            {!isCollapsed && (
              <h4 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                {section.label}
              </h4>
            )}
            <div className="space-y-1">
              {section.routes.map((route) => (
                <div key={route.href} className="flex flex-col">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={route.href}
                          onClick={onClose}
                          className={cn(
                            "text-sm font-medium transition-colors hover:text-primary group",
                            route.href === location.pathname
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          <Button
                            variant={
                              route.href === location.pathname
                                ? "secondary"
                                : "ghost"
                            }
                            className={cn(
                              "w-full justify-start",
                              isCollapsed && "px-2"
                            )}
                          >
                            <route.icon
                              className={cn(
                                "h-4 w-4",
                                route.color,
                                "transition-transform duration-200",
                                route.subItems?.length && "group-hover:rotate-180"
                              )}
                            />
                            {!isCollapsed && (
                              <span className="ml-2">{route.label}</span>
                            )}
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right">
                          {route.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>

                  {route.subItems?.map((subItem) => (
                    <TooltipProvider key={subItem.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={subItem.href}
                            onClick={onClose}
                            className={cn(
                              "text-sm font-medium transition-colors hover:text-primary",
                              isCollapsed ? "ml-2" : "ml-6",
                              "block",
                              subItem.href === location.pathname
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          >
                            <Button
                              variant={
                                subItem.href === location.pathname
                                  ? "secondary"
                                  : "ghost"
                              }
                              className={cn(
                                "w-full justify-start",
                                isCollapsed && "px-2"
                              )}
                            >
                              <subItem.icon
                                className={cn("h-4 w-4", subItem.color)}
                              />
                              {!isCollapsed && (
                                <span className="ml-2">{subItem.label}</span>
                              )}
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right">
                            {subItem.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ))}
            </div>
            {idx < routes.length - 1 && (
              <Separator className="my-4 opacity-50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { routes } from "@/config/routes";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function SidebarNavigation() {
  const location = useLocation();

  return (
    <div className="flex-1 py-6">
      <div className="space-y-1">
        {routes.map((section, idx) => (
          <div key={section.label} className="px-3 py-2">
            {section.routes.map((route) => (
              <div key={route.href}>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={route.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
                          "group-hover:justify-start justify-center",
                          "hover:bg-accent/50",
                          route.href === location.pathname || location.pathname.startsWith(route.href + '/')
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <route.icon className={cn("h-5 w-5 shrink-0", route.color)} />
                        <span className="hidden group-hover:block truncate">
                          {route.label}
                        </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="group-hover:hidden">
                      {route.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {route.subItems?.map((subItem) => (
                  <TooltipProvider key={subItem.href} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={subItem.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 ml-2 rounded-md transition-all duration-200",
                            "group-hover:justify-start justify-center",
                            "hover:bg-accent/50",
                            subItem.href === location.pathname
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <subItem.icon className={cn("h-4 w-4 shrink-0", subItem.color)} />
                          <span className="hidden group-hover:block truncate">
                            {subItem.label}
                          </span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="group-hover:hidden">
                        {subItem.label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ))}
            {idx < routes.length - 1 && (
              <Separator className="my-4 opacity-50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

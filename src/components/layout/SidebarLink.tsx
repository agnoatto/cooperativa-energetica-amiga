
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive?: boolean;
  subItems?: {
    href: string;
    icon: React.ElementType;
    label: string;
  }[];
  isExpanded?: boolean;
}

export function SidebarLink({ href, icon: Icon, children, isActive, subItems, isExpanded }: SidebarLinkProps) {
  const location = useLocation();
  const isParentOfActive = subItems?.some(item => location.pathname === item.href);

  return (
    <div className="w-full">
      <Link
        to={href}
        className={cn(
          "flex items-center py-2 text-sm font-medium rounded-md transition-colors w-full",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          (isActive || isParentOfActive) && "bg-gray-100 dark:bg-gray-800"
        )}
      >
        <div className="min-w-[64px] flex justify-center">
          <Icon className="h-5 w-5 shrink-0" />
        </div>
        <span className={cn(
          "truncate transition-all duration-200",
          isExpanded ? "opacity-100" : "opacity-0"
        )}>
          {children}
        </span>
      </Link>
      
      {subItems && (
        <div className="space-y-1">
          {subItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center py-2 text-sm font-medium rounded-md transition-colors w-full",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                location.pathname === item.href && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              <div className="min-w-[64px] flex justify-center">
                <item.icon className="h-5 w-5 shrink-0" />
              </div>
              <span className={cn(
                "truncate transition-all duration-200",
                isExpanded ? "opacity-100" : "opacity-0"
              )}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

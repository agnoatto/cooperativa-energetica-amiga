
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  Home,
  Users,
  Server,
  Database,
  Settings,
  FileText,
  Table
} from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive?: boolean;
}

const SidebarLink = ({ href, icon: Icon, children, isActive }: SidebarLinkProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive && "bg-gray-100 dark:bg-gray-800"
      )}
    >
      <Icon className="h-5 w-5 mr-3 shrink-0" />
      <span className="truncate">{children}</span>
    </Link>
  );
};

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r shadow-sm",
        "transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16 hover:w-64"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 py-6 space-y-1">
          <nav className="px-2 space-y-1">
            <SidebarLink 
              href="/dashboard" 
              icon={Home}
              isActive={location.pathname === '/dashboard'}
            >
              Dashboard
            </SidebarLink>
            <SidebarLink 
              href="/cooperados" 
              icon={Users}
              isActive={location.pathname === '/cooperados'}
            >
              Cooperados
            </SidebarLink>
            <SidebarLink 
              href="/usinas" 
              icon={Server}
              isActive={location.pathname === '/usinas'}
            >
              Usinas
            </SidebarLink>
            <SidebarLink 
              href="/unidades-usina" 
              icon={Database}
              isActive={location.pathname === '/unidades-usina'}
            >
              Unidades Usina
            </SidebarLink>
            <SidebarLink 
              href="/faturas" 
              icon={FileText}
              isActive={location.pathname === '/faturas'}
            >
              Faturas
            </SidebarLink>
            <SidebarLink 
              href="/pagamentos" 
              icon={Table}
              isActive={location.pathname === '/pagamentos'}
            >
              Pagamentos
            </SidebarLink>
          </nav>
        </div>
        <div className="p-2 border-t">
          <SidebarLink 
            href="/configuracoes" 
            icon={Settings}
            isActive={location.pathname === '/configuracoes'}
          >
            Configurações
          </SidebarLink>
        </div>
      </div>
    </aside>
  );
}

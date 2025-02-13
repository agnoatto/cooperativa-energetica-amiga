
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
  Table,
  Building2,
  User,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine
} from 'lucide-react';

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

const SidebarLink = ({ href, icon: Icon, children, isActive, subItems, isExpanded }: SidebarLinkProps) => {
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
};

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r shadow-sm",
        "transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 py-6">
          <nav className="space-y-1">
            <SidebarLink 
              href="/dashboard" 
              icon={Home}
              isActive={location.pathname === '/dashboard'}
              isExpanded={isExpanded}
            >
              Dashboard
            </SidebarLink>

            <SidebarLink 
              href="/cooperados" 
              icon={Users}
              isActive={location.pathname === '/cooperados'}
              isExpanded={isExpanded}
              subItems={[
                {
                  href: "/cooperados/unidades",
                  icon: Building2,
                  label: "Unidades Beneficiárias"
                }
              ]}
            >
              Cooperados
            </SidebarLink>

            <SidebarLink 
              href="/usinas" 
              icon={Server}
              isActive={location.pathname === '/usinas'}
              isExpanded={isExpanded}
              subItems={[
                {
                  href: "/usinas/investidores",
                  icon: User,
                  label: "Investidores"
                },
                {
                  href: "/unidades-usina",
                  icon: Building2,
                  label: "Unidades de Usina"
                }
              ]}
            >
              Usinas
            </SidebarLink>

            <SidebarLink 
              href="/faturas" 
              icon={FileText}
              isActive={location.pathname === '/faturas'}
              isExpanded={isExpanded}
            >
              Faturas
            </SidebarLink>

            <SidebarLink 
              href="/pagamentos" 
              icon={Table}
              isActive={location.pathname === '/pagamentos'}
              isExpanded={isExpanded}
            >
              Pagamentos
            </SidebarLink>

            {/* Novo menu Financeiro */}
            <SidebarLink 
              href="#" 
              icon={Wallet}
              isActive={location.pathname.startsWith('/financeiro')}
              isExpanded={isExpanded}
              subItems={[
                {
                  href: "/financeiro/contas-pagar",
                  icon: ArrowUpFromLine,
                  label: "Contas a Pagar"
                },
                {
                  href: "/financeiro/contas-receber",
                  icon: ArrowDownToLine,
                  label: "Contas a Receber"
                }
              ]}
            >
              Financeiro
            </SidebarLink>
          </nav>
        </div>

        <div className="border-t">
          <SidebarLink 
            href="/configuracoes" 
            icon={Settings}
            isActive={location.pathname === '/configuracoes'}
            isExpanded={isExpanded}
          >
            Configurações
          </SidebarLink>
        </div>
      </div>
    </aside>
  );
}

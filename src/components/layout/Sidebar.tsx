
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  ArrowUpFromLine,
  LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

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
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return profile;
    }
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

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
        {/* Perfil do usuário */}
        <div className={cn(
          "p-4 border-b flex items-center gap-3",
          !isExpanded && "justify-center"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>
              {profile?.nome?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className={cn(
            "text-sm font-medium truncate transition-all duration-200",
            isExpanded ? "opacity-100" : "opacity-0"
          )}>
            {profile?.nome || 'Usuário'}
          </span>
        </div>

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

            <SidebarLink 
              href="/financeiro/contas-receber" 
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

          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center py-2 text-sm font-medium rounded-md transition-colors",
              "hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
            )}
          >
            <div className="min-w-[64px] flex justify-center">
              <LogOut className="h-5 w-5 shrink-0" />
            </div>
            <span className={cn(
              "truncate transition-all duration-200",
              isExpanded ? "opacity-100" : "opacity-0"
            )}>
              Sair
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

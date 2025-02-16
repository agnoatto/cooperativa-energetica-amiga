import { useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  Home,
  Users,
  Server,
  Building2,
  User,
  FileText,
  Table,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { SidebarLink } from './SidebarLink';
import { SidebarProfile } from './SidebarProfile';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
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
        "transition-all duration-300 ease-in-out w-16 hover:w-64"
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <SidebarProfile 
          nome={profile?.nome}
          avatarUrl={profile?.avatar_url}
        />

        <div className="flex-1 py-6">
          <nav className="space-y-1">
            <SidebarLink 
              href="/dashboard" 
              icon={Home}
              isActive={location.pathname === '/dashboard'}
              isExpanded={false}
            >
              Dashboard
            </SidebarLink>

            <SidebarLink 
              href="/cooperados" 
              icon={Users}
              isActive={location.pathname === '/cooperados'}
              isExpanded={false}
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
              isExpanded={false}
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
              isExpanded={false}
            >
              Faturas
            </SidebarLink>

            <SidebarLink 
              href="/pagamentos" 
              icon={Table}
              isActive={location.pathname === '/pagamentos'}
              isExpanded={false}
            >
              Pagamentos
            </SidebarLink>

            <SidebarLink 
              href="/financeiro/contas-receber" 
              icon={Wallet}
              isActive={location.pathname.startsWith('/financeiro')}
              isExpanded={false}
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
            isExpanded={false}
          >
            Configurações
          </SidebarLink>

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
            <span className="truncate opacity-0 hover:opacity-100 transition-opacity duration-200">
              Sair
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

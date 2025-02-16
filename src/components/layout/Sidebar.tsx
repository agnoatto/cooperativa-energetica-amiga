
import { useLocation, useNavigate } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SidebarLink } from './SidebarLink';
import { SidebarProfile } from './SidebarProfile';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  // Monitora mudanças na sessão
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Query do perfil só é executada quando há uma sessão válida
  const { data: profile, isError } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        // Se houver erro de autenticação, faz logout
        if (error.code === 'PGRST301' || error.code === '401') {
          await supabase.auth.signOut();
          navigate('/auth');
          return null;
        }
        throw error;
      }

      return data;
    },
    enabled: !!session?.user?.id, // Só executa quando há um usuário autenticado
    retry: 1, // Limita o número de tentativas em caso de erro
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

  // Se não houver sessão, não renderiza o sidebar
  if (!session) return null;

  // Se houver erro no carregamento do perfil, mostra mensagem
  if (isError) {
    toast.error('Erro ao carregar informações do usuário');
    return null;
  }

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

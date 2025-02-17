
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Iniciando efeito de autenticação');
    
    // Função para verificar se o token está expirado
    const isTokenExpired = (session: Session | null) => {
      if (!session) return true;
      const expirationTime = session.expires_at * 1000; // Converter para milissegundos
      return Date.now() >= expirationTime;
    };

    // Função para carregar o perfil do usuário
    const loadProfile = async (userId: string) => {
      try {
        console.log('AuthContext: Carregando perfil do usuário:', userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        console.log('AuthContext: Perfil carregado com sucesso:', data);
        return data;
      } catch (error) {
        console.error('AuthContext: Erro ao carregar perfil:', error);
        return null;
      }
    };

    // Função para lidar com mudanças de autenticação
    const handleAuthChange = async (event: string, currentSession: Session | null) => {
      console.log('AuthContext: Evento de autenticação:', event, 'Sessão atual:', !!currentSession);

      setIsLoading(true);

      try {
        // Se o token expirou ou não há sessão, limpar estados
        if (!currentSession || isTokenExpired(currentSession)) {
          console.log('AuthContext: Sem sessão válida, limpando estados');
          setSession(null);
          setUser(null);
          setProfile(null);
          
          // Apenas redirecionar se não estiver já na página de autenticação
          if (window.location.pathname !== '/auth') {
            console.log('AuthContext: Redirecionando para /auth');
            navigate('/auth');
          }
          return;
        }

        // Atualizar estados com a nova sessão
        console.log('AuthContext: Atualizando estados com nova sessão');
        setSession(currentSession);
        setUser(currentSession.user);

        // Carregar perfil se necessário
        if (currentSession.user) {
          const userProfile = await loadProfile(currentSession.user.id);
          setProfile(userProfile);
        }

        // Se estiver na página de auth e tiver uma sessão válida, redirecionar para dashboard
        if (window.location.pathname === '/auth' && currentSession) {
          console.log('AuthContext: Redirecionando para /dashboard');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('AuthContext: Erro ao processar mudança de autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Buscar sessão inicial
    let mounted = true;
    console.log('AuthContext: Buscando sessão inicial');
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        handleAuthChange('INITIAL_SESSION', session);
      }
    });

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      console.log('AuthContext: Limpando efeito de autenticação');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]); // Removido profile das dependências

  const signOut = async () => {
    try {
      console.log('AuthContext: Iniciando logout');
      setIsLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      navigate('/auth');
    } catch (error) {
      console.error('AuthContext: Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

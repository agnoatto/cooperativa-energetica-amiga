import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { ProfileWithRole } from '@/components/configuracoes/hooks/useProfile';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: ProfileWithRole | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    console.log('AuthContext: Iniciando efeito de autenticação');
    
    // Função para verificar se o token está expirado
    const isTokenExpired = (session: Session | null) => {
      if (!session) return true;
      const expirationTime = session.expires_at * 1000;
      const isExpired = Date.now() >= expirationTime;
      console.log('AuthContext: Token expirado?', isExpired);
      return isExpired;
    };

    // Função para carregar o perfil do usuário com retry
    const loadProfile = async (userId: string) => {
      try {
        console.log('AuthContext: Carregando perfil do usuário:', userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('*, user_roles!inner(role)')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          const profileWithRole: ProfileWithRole = {
            ...data,
            role: data.user_roles?.[0]?.role || 'user'
          };
          console.log('AuthContext: Perfil carregado com sucesso:', profileWithRole);
          return profileWithRole;
        }
        
        return null;
      } catch (error) {
        console.error('AuthContext: Erro ao carregar perfil:', error);
        if (retryCount < MAX_RETRIES) {
          console.log('AuthContext: Tentando novamente...');
          setRetryCount(prev => prev + 1);
          return null;
        }
        throw error;
      }
    };

    // Função para lidar com mudanças de autenticação
    const handleAuthChange = async (event: string, currentSession: Session | null) => {
      console.log('AuthContext: Evento de autenticação:', event, 'Sessão atual:', !!currentSession);
      
      try {
        // Se não houver sessão ou o token estiver expirado
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
        if (currentSession.user && (!profile || profile.id !== currentSession.user.id)) {
          const userProfile = await loadProfile(currentSession.user.id);
          setProfile(userProfile);
        }

        // Se estiver na página de auth e tiver uma sessão válida, redirecionar
        if (window.location.pathname === '/auth' && !isTokenExpired(currentSession)) {
          console.log('AuthContext: Redirecionando para /dashboard');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('AuthContext: Erro ao processar mudança de autenticação:', error);
      } finally {
        // Sempre definir isLoading como false no final
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
    }).catch(error => {
      console.error('AuthContext: Erro ao buscar sessão inicial:', error);
      setIsLoading(false);
    });

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session);
    });

    return () => {
      console.log('AuthContext: Limpando efeito de autenticação');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, profile, retryCount]);

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

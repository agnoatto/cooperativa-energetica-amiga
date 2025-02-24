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
    
    const isTokenExpired = (session: Session | null) => {
      if (!session) return true;
      const expirationTime = session.expires_at * 1000;
      const isExpired = Date.now() >= expirationTime;
      console.log('AuthContext: Token expirado?', isExpired);
      return isExpired;
    };

    const loadProfile = async (userId: string) => {
      try {
        console.log('AuthContext: Carregando perfil do usuário:', userId);
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            user_roles (
              role
            )
          `)
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          const profileWithRole: ProfileWithRole = {
            ...data,
            user_roles: data.user_roles || [],
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

    const handleAuthChange = async (event: string, currentSession: Session | null) => {
      console.log('AuthContext: Evento de autenticação:', event, 'Sessão atual:', !!currentSession);
      
      try {
        if (!currentSession || isTokenExpired(currentSession)) {
          console.log('AuthContext: Sem sessão válida, limpando estados');
          setSession(null);
          setUser(null);
          setProfile(null);
          
          if (window.location.pathname !== '/auth') {
            console.log('AuthContext: Redirecionando para /auth');
            navigate('/auth');
          }
          return;
        }

        console.log('AuthContext: Atualizando estados com nova sessão');
        setSession(currentSession);
        setUser(currentSession.user);

        if (currentSession.user && (!profile || profile.id !== currentSession.user.id)) {
          const userProfile = await loadProfile(currentSession.user.id);
          setProfile(userProfile);
        }

        if (window.location.pathname === '/auth' && !isTokenExpired(currentSession)) {
          console.log('AuthContext: Redirecionando para /dashboard');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('AuthContext: Erro ao processar mudança de autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

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

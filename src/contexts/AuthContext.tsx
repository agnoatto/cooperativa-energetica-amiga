
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
    // Função para verificar se o token está expirado
    const isTokenExpired = (session: Session | null) => {
      if (!session) return true;
      const expirationTime = session.expires_at * 1000; // Converter para milissegundos
      return Date.now() >= expirationTime;
    };

    // Função para carregar o perfil do usuário
    const loadProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        return null;
      }
    };

    // Função para lidar com mudanças de autenticação
    const handleAuthChange = async (event: string, currentSession: Session | null) => {
      // Não atualizar estado se nada mudou
      if (event === 'INITIAL_SESSION' && currentSession === session) {
        return;
      }

      // Se o token expirou ou não há sessão, limpar estados e redirecionar
      if (!currentSession || isTokenExpired(currentSession)) {
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        
        if (window.location.pathname !== '/auth') {
          navigate('/auth');
        }
        return;
      }

      // Atualizar estados com a nova sessão
      setSession(currentSession);
      setUser(currentSession.user);

      // Carregar perfil se necessário
      if (currentSession.user && (!profile || profile.id !== currentSession.user.id)) {
        const userProfile = await loadProfile(currentSession.user.id);
        setProfile(userProfile);
      }

      setIsLoading(false);

      // Se estiver na página de auth e tiver uma sessão válida, redirecionar para dashboard
      if (window.location.pathname === '/auth' && currentSession) {
        navigate('/dashboard');
      }
    };

    // Buscar sessão inicial
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        handleAuthChange('INITIAL_SESSION', session);
      }
    });

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        handleAuthChange(event, session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, profile]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
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


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

    // Função para lidar com mudanças de autenticação
    const handleAuthChange = async (event: string, currentSession: Session | null) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      // Se o token expirou ou o usuário não está autenticado, redirecionar para login
      if (isTokenExpired(currentSession) || !currentSession) {
        console.log('Token expirado ou sessão inválida, redirecionando para login...');
        setProfile(null);
        navigate('/auth');
        return;
      }

      // Se houver uma sessão válida, carregar o perfil
      if (currentSession?.user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .maybeSingle();

          if (error) throw error;
          setProfile(data);
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
          setProfile(null);
        }
      }

      setIsLoading(false);
    };

    // Buscar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange('INITIAL_SESSION', session);
    });

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Configurar verificação periódica do token
    const checkTokenInterval = setInterval(() => {
      if (session && isTokenExpired(session)) {
        console.log('Token expirou durante verificação periódica');
        handleAuthChange('TOKEN_EXPIRED', null);
      }
    }, 60000); // Verificar a cada minuto

    return () => {
      subscription.unsubscribe();
      clearInterval(checkTokenInterval);
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
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

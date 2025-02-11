
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Sidebar } from "./components/layout/Sidebar";
import Auth from "./pages/Auth";
import Cooperados from "./pages/Cooperados";
import UnidadesBeneficiarias from "./pages/UnidadesBeneficiarias";
import Dashboard from "./pages/Dashboard";
import Faturas from "./pages/Faturas";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Pagamentos from "./pages/Pagamentos";
import UnidadesUsina from "./pages/UnidadesUsina";
import Usinas from "./pages/Usinas";
import Investidores from "./pages/Investidores";
import Configuracoes from "./pages/Configuracoes";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {session && <Sidebar />}
        <main className={cn(
          "min-h-screen transition-all duration-300",
          session && "pl-16" // Mantém espaço para o menu recolhido
        )}>
          <Routes>
            <Route
              path="/"
              element={
                session ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/auth"
              element={session ? <Navigate to="/dashboard" replace /> : <Auth />}
            />
            <Route
              path="/dashboard"
              element={session ? <Dashboard /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/cooperados"
              element={session ? <Cooperados /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/cooperados/unidades"
              element={session ? <UnidadesBeneficiarias /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/usinas"
              element={session ? <Usinas /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/usinas/investidores"
              element={session ? <Investidores /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/unidades-usina"
              element={
                session ? <UnidadesUsina /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/faturas"
              element={session ? <Faturas /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/pagamentos"
              element={session ? <Pagamentos /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/configuracoes"
              element={session ? <Configuracoes /> : <Navigate to="/auth" replace />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;

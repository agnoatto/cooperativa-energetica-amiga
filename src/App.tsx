
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Sidebar } from "./components/layout/Sidebar";
import { cn } from "@/lib/utils";
import Auth from "./pages/Auth";
import Cooperados from "./pages/Cooperados";
import UnidadesBeneficiarias from "./pages/UnidadesBeneficiarias";
import Dashboard from "./pages/Dashboard";
import Faturas from "./pages/Faturas";
import NotFound from "./pages/NotFound";
import Pagamentos from "./pages/Pagamentos";
import UnidadesUsina from "./pages/UnidadesUsina";
import Usinas from "./pages/Usinas";
import Investidores from "./pages/Investidores";
import Configuracoes from "./pages/Configuracoes";
import ContasPagar from "./pages/ContasPagar";
import ContasReceber from "./pages/ContasReceber";
import { useAuth, AuthProvider } from "./contexts/AuthContext";

function AppContent() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Função auxiliar para proteger rotas
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) {
      return <Navigate to="/auth" replace />;
    }
    return <>{children}</>;
  };

  return (
    <div className="flex min-h-screen">
      {session && <Sidebar />}
      <main
        className={cn(
          "flex-1 min-h-screen transition-all duration-300 bg-gray-50 dark:bg-gray-900",
          session && "pl-16 lg:pl-16"
        )}
      >
        <div className="p-6">
          <Routes>
            {/* Rota inicial redireciona para dashboard ou auth */}
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

            {/* Rota de autenticação */}
            <Route
              path="/auth"
              element={session ? <Navigate to="/dashboard" replace /> : <Auth />}
            />

            {/* Rotas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cooperados"
              element={
                <ProtectedRoute>
                  <Cooperados />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cooperados/unidades"
              element={
                <ProtectedRoute>
                  <UnidadesBeneficiarias />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usinas"
              element={
                <ProtectedRoute>
                  <Usinas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usinas/investidores"
              element={
                <ProtectedRoute>
                  <Investidores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/unidades-usina"
              element={
                <ProtectedRoute>
                  <UnidadesUsina />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faturas"
              element={
                <ProtectedRoute>
                  <Faturas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pagamentos"
              element={
                <ProtectedRoute>
                  <Pagamentos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/financeiro/contas-pagar"
              element={
                <ProtectedRoute>
                  <ContasPagar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/financeiro/contas-receber"
              element={
                <ProtectedRoute>
                  <ContasReceber />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <ProtectedRoute>
                  <Configuracoes />
                </ProtectedRoute>
              }
            />

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

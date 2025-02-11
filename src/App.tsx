
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import { Toaster } from "./components/ui/toaster";
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
import { AuthProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./components/auth/AuthGuard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppSidebar>
          <Routes>
            {/* Public routes */}
            <Route
              path="/auth"
              element={
                <AuthGuard requireAuth={false}>
                  <Auth />
                </AuthGuard>
              }
            />

            {/* Protected routes */}
            <Route path="/" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/cooperados"
              element={
                <AuthGuard>
                  <Cooperados />
                </AuthGuard>
              }
            />
            <Route
              path="/cooperados/unidades"
              element={
                <AuthGuard>
                  <UnidadesBeneficiarias />
                </AuthGuard>
              }
            />
            <Route
              path="/usinas"
              element={
                <AuthGuard>
                  <Usinas />
                </AuthGuard>
              }
            />
            <Route
              path="/usinas/investidores"
              element={
                <AuthGuard>
                  <Investidores />
                </AuthGuard>
              }
            />
            <Route
              path="/unidades-usina"
              element={
                <AuthGuard>
                  <UnidadesUsina />
                </AuthGuard>
              }
            />
            <Route
              path="/faturas"
              element={
                <AuthGuard>
                  <Faturas />
                </AuthGuard>
              }
            />
            <Route
              path="/pagamentos"
              element={
                <AuthGuard>
                  <Pagamentos />
                </AuthGuard>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <AuthGuard>
                  <Configuracoes />
                </AuthGuard>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppSidebar>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

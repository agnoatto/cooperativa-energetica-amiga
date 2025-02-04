import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import { Toaster } from "./components/ui/toaster";
import Auth from "./pages/Auth";
import Cooperados from "./pages/Cooperados";
import Dashboard from "./pages/Dashboard";
import Faturas from "./pages/Faturas";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Pagamentos from "./pages/Pagamentos";
import UnidadesUsina from "./pages/UnidadesUsina";
import Usinas from "./pages/Usinas";
import Investidores from "./pages/Investidores";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppSidebar>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cooperados" element={<Cooperados />} />
            <Route path="/usinas" element={<Usinas />} />
            <Route path="/usinas/investidores" element={<Investidores />} />
            <Route path="/unidades-usina" element={<UnidadesUsina />} />
            <Route path="/faturas" element={<Faturas />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppSidebar>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
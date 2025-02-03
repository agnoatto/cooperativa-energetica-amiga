import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Pages
import Dashboard from "./pages/Dashboard";
import Cooperados from "./pages/Cooperados";
import Usinas from "./pages/Usinas";
import Faturas from "./pages/Faturas";
import Pagamentos from "./pages/Pagamentos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 p-6">
              <SidebarTrigger className="mb-4" />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cooperados" element={<Cooperados />} />
                <Route path="/usinas" element={<Usinas />} />
                <Route path="/faturas" element={<Faturas />} />
                <Route path="/pagamentos" element={<Pagamentos />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarUserSection } from "./sidebar/SidebarUserSection";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function AppSidebar({ children }: SidebarProps) {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };

    initializeUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Erro ao realizar logout",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  if (!isMobile) {
    return (
      <div className="relative min-h-screen flex">
        <aside className="fixed left-0 top-0 h-full group/sidebar">
          <nav className="h-full w-16 group-hover/sidebar:w-64 transition-[width] duration-300 ease-in-out 
                         bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
                         border-r border-border/40">
            <div className="flex flex-col h-full">
              <SidebarNavigation />
              <SidebarUserSection user={user} onLogout={handleLogout} />
            </div>
          </nav>
        </aside>
        <main className="flex-1 pl-16">
          <div className="h-full px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="ml-2 mt-2">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          <div className="h-full">
            <SidebarNavigation />
            <SidebarUserSection user={user} onLogout={handleLogout} />
          </div>
        </SheetContent>
      </Sheet>
      <main className="flex-1">
        <div className="h-full px-4 py-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

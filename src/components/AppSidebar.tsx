import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { NavigationMenu } from "./sidebar/NavigationMenu";
import { UserSection } from "./sidebar/UserSection";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function AppSidebar({ className, children }: SidebarProps) {
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
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <Sidebar 
            collapsible="icon"
            variant="floating"
            className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          >
            <SidebarContent>
              <div className="h-full">
                <NavigationMenu onClose={() => setOpen(false)} />
                <UserSection user={user} onLogout={handleLogout} />
              </div>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
          <main className="flex-1 overflow-hidden">
            <div className="h-full px-4 py-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // Mobile view (mantendo o drawer atual)
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
            <NavigationMenu onClose={() => setOpen(false)} />
            <UserSection user={user} onLogout={handleLogout} />
          </div>
        </SheetContent>
      </Sheet>
      <main className="flex-1 overflow-hidden">
        <div className="h-full px-4 py-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

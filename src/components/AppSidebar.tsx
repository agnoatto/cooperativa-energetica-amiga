
import * as React from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { NavigationMenu } from "./sidebar/NavigationMenu";
import { UserSection } from "./sidebar/UserSection";

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

  const sidebar = (
    <div className={cn("pb-12", className)}>
      <NavigationMenu onClose={() => setOpen(false)} />
      <UserSection user={user} onLogout={handleLogout} />
    </div>
  );

  if (!isMobile) {
    return (
      <div className="flex">
        <div className="hidden w-[200px] flex-col md:flex">
          <ScrollArea className="flex-1">{sidebar}</ScrollArea>
        </div>
        <main className="flex-1 p-8 pt-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="ml-2 mt-2">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col">{sidebar}</nav>
        </SheetContent>
      </Sheet>
      <main className="flex-1 p-8 pt-6">{children}</main>
    </div>
  );
}

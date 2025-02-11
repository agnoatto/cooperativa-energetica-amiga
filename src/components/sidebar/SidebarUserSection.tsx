
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface UserSectionProps {
  user: SupabaseUser | null;
  onLogout: () => void;
}

export function SidebarUserSection({ user, onLogout }: UserSectionProps) {
  if (!user) return null;

  return (
    <div className="p-3 border-t border-border/40">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md",
              "group-hover/sidebar:justify-start justify-center",
            )}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden group-hover/sidebar:block min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.user_metadata?.full_name || 'Usuário'}
                </p>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="group-hover/sidebar:hidden">
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {user.user_metadata?.full_name || 'Usuário'}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full mt-2 gap-3",
                "group-hover/sidebar:justify-start justify-center",
                "hover:bg-destructive/10 hover:text-destructive"
              )}
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden group-hover/sidebar:block">
                Sair
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="group-hover/sidebar:hidden">
            Sair
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

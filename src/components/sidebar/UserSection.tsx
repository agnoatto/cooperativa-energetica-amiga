
import { LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
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

export function UserSection({ user, onLogout }: UserSectionProps) {
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  if (!user) return null;

  return (
    <div className={cn(
      "p-4 border-t",
      isCollapsed && "flex flex-col items-center"
    )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "flex items-center gap-4 mb-4",
              isCollapsed && "flex-col gap-2"
            )}>
              <Avatar>
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.user_metadata?.full_name || 'Usuário'}
                  </p>
                </div>
              )}
            </div>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  {user.user_metadata?.full_name || 'Usuário'}
                </p>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <Button
        variant="outline"
        className={cn(
          "w-full justify-start",
          isCollapsed && "px-2 w-10 h-10"
        )}
        onClick={onLogout}
      >
        <LogOut className={cn(
          "h-4 w-4",
          !isCollapsed && "mr-2"
        )} />
        {!isCollapsed && "Sair"}
      </Button>
    </div>
  );
}

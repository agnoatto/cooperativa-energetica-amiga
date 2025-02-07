
import { LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User as SupabaseUser } from '@supabase/supabase-js';

interface UserSectionProps {
  user: SupabaseUser | null;
  onLogout: () => void;
}

export function UserSection({ user, onLogout }: UserSectionProps) {
  if (!user) return null;

  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-4 mb-4">
        <Avatar>
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback>
            {user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {user.email}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user.user_metadata?.full_name || 'Usuário'}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  );
}

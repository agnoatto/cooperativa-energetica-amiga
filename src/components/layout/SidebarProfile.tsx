
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from "@/lib/utils";

interface SidebarProfileProps {
  nome?: string;
  avatarUrl?: string;
}

export function SidebarProfile({ nome, avatarUrl }: SidebarProfileProps) {
  return (
    <div className={cn(
      "p-4 border-b flex items-center gap-3",
      "w-16 hover:w-full"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          {nome?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium truncate opacity-0 hover:opacity-100 transition-opacity duration-200">
        {nome || 'Usuário'}
      </span>
    </div>
  );
}

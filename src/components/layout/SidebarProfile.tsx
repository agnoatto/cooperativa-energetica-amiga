
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from "@/lib/utils";

interface SidebarProfileProps {
  nome?: string;
  avatarUrl?: string;
  isExpanded?: boolean;
}

export function SidebarProfile({ nome, avatarUrl, isExpanded }: SidebarProfileProps) {
  return (
    <div className="p-4 border-b flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          {nome?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <span className={cn(
        "text-sm font-medium truncate transition-opacity duration-300",
        isExpanded ? "opacity-100" : "opacity-0"
      )}>
        {nome || 'Usuário'}
      </span>
    </div>
  );
}

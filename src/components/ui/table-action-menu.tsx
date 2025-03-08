
import * as React from "react";
import { MoreVertical, LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TableAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
  show?: boolean;
  tooltip?: string;
}

interface TableActionMenuProps {
  actions: TableAction[];
  triggerClassName?: string;
}

export function TableActionMenu({ actions, triggerClassName }: TableActionMenuProps) {
  const visibleActions = actions.filter(action => action.show !== false);
  
  if (visibleActions.length === 0) {
    return null;
  }
  
  // Separamos ações normais e destrutivas (como excluir)
  const normalActions = visibleActions.filter(action => !action.destructive);
  const destructiveActions = visibleActions.filter(action => action.destructive);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-8 w-8 hover:bg-gray-100", triggerClassName)}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Abrir menu de ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {normalActions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              action.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {React.createElement(action.icon, { className: "h-4 w-4" })}
            <span>{action.label}</span>
          </DropdownMenuItem>
        ))}
        
        {normalActions.length > 0 && destructiveActions.length > 0 && (
          <DropdownMenuSeparator />
        )}
        
        {destructiveActions.map((action, index) => (
          <DropdownMenuItem
            key={`destructive-${index}`}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              "flex items-center gap-2 cursor-pointer text-red-600",
              action.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {React.createElement(action.icon, { className: "h-4 w-4" })}
            <span>{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

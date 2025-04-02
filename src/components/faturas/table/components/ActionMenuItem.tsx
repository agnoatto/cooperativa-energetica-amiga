
/**
 * Componente para um item individual do menu de ações da fatura
 * 
 * Este componente renderiza um botão dentro do menu de ações com ícone e texto.
 * Otimizado para funcionar com o componente Popover.
 */
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ActionMenuItemProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function ActionMenuItem({ 
  icon, 
  label, 
  onClick, 
  disabled = false,
  variant = "ghost" 
}: ActionMenuItemProps) {
  return (
    <Button
      className="w-full justify-start font-normal px-2 py-1.5 h-9"
      variant={variant}
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  );
}

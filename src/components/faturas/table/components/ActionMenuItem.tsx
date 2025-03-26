
/**
 * Componente para um item individual do menu de ações da fatura
 * 
 * Este componente renderiza um botão dentro do menu de ações com ícone e texto.
 */
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ActionMenuItemProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ActionMenuItem({ icon, label, onClick, disabled = false }: ActionMenuItemProps) {
  return (
    <button
      className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
}

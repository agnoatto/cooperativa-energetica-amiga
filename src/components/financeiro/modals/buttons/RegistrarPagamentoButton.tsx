
/**
 * Botão para registrar pagamento
 * 
 * Este componente renderiza um botão estilizado específico para a ação
 * de registrar pagamentos de lançamentos financeiros.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface RegistrarPagamentoButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function RegistrarPagamentoButton({ onClick, disabled }: RegistrarPagamentoButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 flex items-center gap-1"
      disabled={disabled}
    >
      <DollarSign className="h-4 w-4" />
      Registrar Pagamento
    </Button>
  );
}

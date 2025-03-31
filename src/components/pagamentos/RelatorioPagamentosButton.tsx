
/**
 * Botão para visualização de relatório de pagamentos
 * 
 * Este componente renderiza um botão que permite visualizar e gerar relatórios
 * consolidados de pagamentos, oferecendo visão gerencial dos dados.
 */
import { Button } from "@/components/ui/button";
import { FileBarChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface RelatorioPagamentosButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function RelatorioPagamentosButton({ onClick, disabled = false }: RelatorioPagamentosButtonProps) {
  const isMobile = useIsMobile();
  
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2"
      size={isMobile ? "icon" : "default"}
    >
      <FileBarChart className="h-4 w-4" />
      {!isMobile && "Relatório"}
    </Button>
  );
}


/**
 * Botão para reativação de cooperados inativos
 * 
 * Este componente exibe um botão que permite reativar cooperados que foram
 * marcados como inativos no sistema.
 */
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReativarButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ReativarButton({ onClick }: ReativarButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClick}
      className="text-green-600"
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Reativar
    </Button>
  );
}

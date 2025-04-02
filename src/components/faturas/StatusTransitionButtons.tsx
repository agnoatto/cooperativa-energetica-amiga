
/**
 * Botões para transição de status de faturas
 * 
 * Este componente renderiza botões que permitem a transição entre diferentes status
 * de faturas, seguindo o fluxo definido para cada tipo de transição.
 * Após o envio, o controle de pagamentos é feito pelo módulo Financeiro.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Adicionando tipagem para as novas props
interface StatusTransitionButtonsProps {
  fatura: Fatura;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  size?: "default" | "sm" | "lg" | "icon"; // Tamanhos do botão
  direction?: "row" | "column"; // Direção do flex
  className?: string; // Classes adicionais
}

export function StatusTransitionButtons({
  fatura,
  onUpdateStatus,
  size = "default",
  direction = "row", 
  className
}: StatusTransitionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Determinar quais status estão disponíveis para transição com base no status atual
  const availableTransitions = getAvailableTransitions(fatura.status);

  const handleUpdateStatus = async (newStatus: FaturaStatus) => {
    setIsLoading(true);
    try {
      await onUpdateStatus(fatura, newStatus);
      toast.success(`Status atualizado para ${newStatus}`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status da fatura");
    } finally {
      setIsLoading(false);
    }
  };

  // Se não houver transições disponíveis, não renderizar nada
  if (availableTransitions.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "flex gap-2", 
      direction === "column" ? "flex-col" : "flex-row flex-wrap",
      className
    )}>
      {availableTransitions.map((transition) => (
        <Button
          key={transition.status}
          variant="outline"
          size={size}
          onClick={() => handleUpdateStatus(transition.status)}
          disabled={isLoading}
          className={transition.className}
        >
          {transition.icon}
          <span>{transition.label}</span>
        </Button>
      ))}
    </div>
  );
}

// Função auxiliar para obter transições disponíveis com base no status atual
function getAvailableTransitions(currentStatus: FaturaStatus) {
  const transitions: {
    status: FaturaStatus;
    label: string;
    className?: string;
    icon?: React.ReactNode;
  }[] = [];

  // Lógica para determinar transições baseadas no status atual - atualizada para o novo fluxo
  
  if (currentStatus === 'pendente') {
    transitions.push({
      status: 'enviada',
      label: 'Enviar',
      className: 'text-blue-600 hover:bg-blue-50'
    });
    transitions.push({
      status: 'corrigida',
      label: 'Marcar Correção',
      className: 'text-amber-600 hover:bg-amber-50'
    });
  } else if (currentStatus === 'enviada' || currentStatus === 'reenviada' || currentStatus === 'atrasada') {
    // Removida opção de confirmar pagamento - agora é feito no financeiro
    transitions.push({
      status: 'corrigida',
      label: 'Marcar Correção',
      className: 'text-amber-600 hover:bg-amber-50'
    });
  } else if (currentStatus === 'corrigida') {
    transitions.push({
      status: 'reenviada',
      label: 'Reenviar',
      className: 'text-purple-600 hover:bg-purple-50'
    });
  }
  // Removidas transições para status 'paga' e 'finalizada'

  return transitions;
}

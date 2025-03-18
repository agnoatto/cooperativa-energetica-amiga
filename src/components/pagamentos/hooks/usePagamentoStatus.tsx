
/**
 * Hook para gerenciamento de status de pagamentos
 * 
 * Este hook fornece funções e componentes para exibir e alterar
 * o status de pagamentos, com validações de transições e feedback visual.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PagamentoData, PagamentoStatus, SendMethod } from "../types/pagamento";
import { toast } from "sonner";
import { atualizarStatusPagamento } from "@/hooks/pagamentos/mutations";

interface StatusConfig {
  label: string;
  tooltip: string;
  variant: "default" | "destructive" | "outline" | "secondary";
}

const STATUS_CONFIG: Record<PagamentoStatus, StatusConfig> = {
  pendente: {
    label: "Pendente",
    tooltip: "Aguardando envio do boletim",
    variant: "outline",
  },
  enviado: {
    label: "Enviado",
    tooltip: "Boletim enviado ao investidor",
    variant: "default",
  },
  pago: {
    label: "Pago",
    tooltip: "Pagamento confirmado",
    variant: "default",
  },
  atrasado: {
    label: "Atrasado",
    tooltip: "Pagamento não realizado até a data de vencimento",
    variant: "destructive",
  },
  cancelado: {
    label: "Cancelado",
    tooltip: "Pagamento cancelado",
    variant: "secondary",
  },
};

export function usePagamentoStatus() {
  const queryClient = useQueryClient();

  const StatusBadge = ({ status }: { status: PagamentoStatus | null }) => {
    if (!status) return null;
    
    const config = STATUS_CONFIG[status];
    if (!config) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant={config.variant}>{config.label}</Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{config.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Mutation para atualizar o status do pagamento usando a função RPC
  const updateStatusMutation = useMutation({
    mutationFn: async (variables: { id: string; method: SendMethod }) => {
      console.log('[usePagamentoStatus] Iniciando envio do pagamento:', variables);
      return await atualizarStatusPagamento(variables.id, 'enviado', variables.method);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] });
      // Aqui pegamos o método diretamente do array ou usamos um valor padrão
      const method = data.send_method?.[0] || 'email';
      toast.success(`Boletim enviado por ${method === 'email' ? 'e-mail' : 'WhatsApp'}`);
    },
    onError: (error: any) => {
      console.error('[usePagamentoStatus] Erro ao enviar boletim:', error);
      toast.error(`Erro ao enviar boletim: ${error.message}`);
    },
  });

  const handleSendPagamento = async (pagamento: PagamentoData, method: SendMethod) => {
    if (!pagamento.status || pagamento.status !== 'pendente') {
      console.error('[usePagamentoStatus] Status inválido para envio:', pagamento.status);
      toast.error('Apenas pagamentos pendentes podem ser enviados');
      return;
    }

    try {
      console.log('[usePagamentoStatus] Iniciando envio do pagamento:', { 
        id: pagamento.id, 
        method,
        status_atual: pagamento.status 
      });
      await updateStatusMutation.mutateAsync({ id: pagamento.id, method });
    } catch (error: any) {
      console.error('[usePagamentoStatus] Erro no processo de envio:', error);
      toast.error(`Erro ao enviar boletim: ${error.message}`);
    }
  };

  return {
    StatusBadge,
    handleSendPagamento,
    isUpdating: updateStatusMutation.isPending
  };
}


import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { PagamentoData, PagamentoStatus, SendMethod } from "../types/pagamento";
import { toast } from "sonner";

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

  const updateStatusMutation = useMutation({
    mutationFn: async (variables: { id: string; method: SendMethod }) => {
      console.log('Atualizando status do pagamento:', variables);
      
      const { data, error } = await supabase.rpc('update_pagamento_status', {
        p_pagamento_id: variables.id,
        p_novo_status: 'enviado',
        p_method: variables.method
      });

      if (error) {
        console.error('Erro na atualização:', error);
        throw error;
      }

      console.log('Resposta da atualização:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] });
      toast.success(`Boletim enviado por ${variables.method === 'email' ? 'e-mail' : 'WhatsApp'}`);
    },
    onError: (error) => {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao enviar boletim');
    },
  });

  const handleSendPagamento = async (pagamento: PagamentoData, method: SendMethod) => {
    if (!pagamento.status || pagamento.status !== 'pendente') {
      throw new Error('Apenas pagamentos pendentes podem ser enviados');
    }

    try {
      console.log('Iniciando envio do pagamento:', { id: pagamento.id, method });
      await updateStatusMutation.mutateAsync({ id: pagamento.id, method });
    } catch (error) {
      console.error('Erro no processo de envio:', error);
      throw error;
    }
  };

  return {
    StatusBadge,
    handleSendPagamento,
  };
}

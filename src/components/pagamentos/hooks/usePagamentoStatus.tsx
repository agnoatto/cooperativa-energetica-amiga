
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

// Função auxiliar para validar transições de status
const validateStatusTransition = (
  oldStatus: PagamentoStatus | null,
  newStatus: PagamentoStatus
): boolean => {
  if (!oldStatus) return true; // Caso seja um novo pagamento

  // Definir transições permitidas
  const allowedTransitions: Record<PagamentoStatus, PagamentoStatus[]> = {
    pendente: ['enviado', 'cancelado'],
    enviado: ['pago', 'atrasado', 'cancelado'],
    atrasado: ['pago', 'cancelado'],
    pago: ['cancelado'],
    cancelado: []
  };

  return allowedTransitions[oldStatus].includes(newStatus);
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
      console.log('[usePagamentoStatus] Iniciando atualização de status:', variables);
      
      try {
        // Verificar perfil do usuário e cooperativa
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('cooperativa_id')
          .single();
          
        if (profileError) {
          console.error('[usePagamentoStatus] Erro ao buscar perfil:', profileError);
          throw new Error(`Erro ao buscar perfil: ${profileError.message}`);
        }
        
        if (!profile?.cooperativa_id) {
          console.error('[usePagamentoStatus] Cooperativa não encontrada');
          throw new Error('Cooperativa não encontrada para o usuário atual');
        }
        
        // Buscar pagamento atual para validação
        const { data: currentPagamento, error: pagamentoError } = await supabase
          .from('pagamentos_usina')
          .select('status')
          .eq('id', variables.id)
          .single();
          
        if (pagamentoError) {
          console.error('[usePagamentoStatus] Erro ao buscar pagamento:', pagamentoError);
          throw new Error(`Erro ao buscar pagamento: ${pagamentoError.message}`);
        }
        
        // Validar transição de status
        const novoStatus = 'enviado';
        if (!validateStatusTransition(currentPagamento.status, novoStatus)) {
          console.error('[usePagamentoStatus] Transição de status inválida:', {
            atual: currentPagamento.status,
            novo: novoStatus
          });
          throw new Error(`Transição de status inválida: ${currentPagamento.status} para ${novoStatus}`);
        }
      
        const { data, error } = await supabase.rpc('update_pagamento_status', {
          p_pagamento_id: variables.id,
          p_novo_status: novoStatus,
          p_method: variables.method
        });

        if (error) {
          console.error('[usePagamentoStatus] Erro na atualização via RPC:', error);
          throw error;
        }

        console.log('[usePagamentoStatus] Resposta da atualização:', data);
        return data;
      } catch (error: any) {
        console.error('[usePagamentoStatus] Erro durante processo de atualização:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] });
      toast.success(`Boletim enviado por ${variables.method === 'email' ? 'e-mail' : 'WhatsApp'}`);
    },
    onError: (error: any) => {
      console.error('[usePagamentoStatus] Erro ao atualizar status:', error);
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

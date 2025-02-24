
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

  const StatusBadge = ({ status }: { status: PagamentoStatus }) => {
    const config = STATUS_CONFIG[status];

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
      const { error } = await supabase
        .from('pagamentos_usina')
        .update({
          status: 'enviado',
          send_method: [variables.method],
          data_envio: new Date().toISOString(),
        })
        .eq('id', variables.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] });
      toast.success('Status atualizado para enviado');
    },
    onError: (error) => {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do pagamento');
    },
  });

  const handleSendPagamento = async (pagamento: PagamentoData, method: SendMethod) => {
    if (pagamento.status !== 'pendente') {
      throw new Error('Apenas pagamentos pendentes podem ser enviados');
    }

    try {
      // Primeiro atualiza o status
      await updateStatusMutation.mutateAsync({ id: pagamento.id, method });

      // Simula o envio (aqui você implementaria a lógica real de envio)
      if (method === 'email') {
        console.log('Enviando por email...');
        toast.success('Boletim enviado por e-mail');
      } else if (method === 'whatsapp') {
        console.log('Enviando por WhatsApp...');
        toast.success('Boletim enviado por WhatsApp');
      }
    } catch (error) {
      console.error('Erro no processo de envio:', error);
      toast.error(`Erro ao enviar por ${method === 'email' ? 'e-mail' : 'WhatsApp'}`);
      throw error;
    }
  };

  return {
    StatusBadge,
    handleSendPagamento
  };
}

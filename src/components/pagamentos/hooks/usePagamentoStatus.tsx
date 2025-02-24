
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

  const handleSendPagamento = async (pagamento: PagamentoData, method: SendMethod) => {
    if (pagamento.status !== 'pendente') {
      throw new Error('Apenas pagamentos pendentes podem ser enviados');
    }

    const { error } = await supabase
      .from('pagamentos_usina')
      .update({
        status: 'enviado',
        send_method: method,
        data_envio: new Date().toISOString(),
        observacao: `Boletim enviado por ${method === 'email' ? 'e-mail' : 'WhatsApp'}`
      })
      .eq('id', pagamento.id);

    if (error) throw error;

    await queryClient.invalidateQueries({ queryKey: ['pagamentos'] });

    if (method === 'email') {
      console.log('Enviando por email...');
    } else if (method === 'whatsapp') {
      console.log('Enviando por WhatsApp...');
    }
  };

  return {
    StatusBadge,
    handleSendPagamento
  };
}

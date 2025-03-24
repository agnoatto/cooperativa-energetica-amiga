
/**
 * Componente de ações de status do lançamento
 * 
 * Exibe botões de ação para alterar o status do lançamento
 */
import { Button } from "@/components/ui/button";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { BanknoteIcon } from "lucide-react";
import { StatusTransitionButtons } from "../StatusTransitionButtons";

interface LancamentoStatusActionsProps {
  lancamento: LancamentoFinanceiro;
  onUpdateStatus: (
    lancamento: LancamentoFinanceiro, 
    newStatus: StatusLancamento, 
    options?: { 
      valorPago?: number;
      valorJuros?: number;
      valorDesconto?: number;
      observacao?: string;
    }
  ) => Promise<void>;
  onOpenRegistrarPagamento: () => void;
}

export function LancamentoStatusActions({ 
  lancamento, 
  onUpdateStatus,
  onOpenRegistrarPagamento 
}: LancamentoStatusActionsProps) {
  return (
    <div className="space-y-3">
      {lancamento.status !== 'pago' && (
        <Button 
          onClick={onOpenRegistrarPagamento}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <BanknoteIcon className="h-4 w-4 mr-2" />
          Registrar Pagamento
        </Button>
      )}
      
      <div className="space-y-2">
        <div className="text-sm font-medium">Alterar Status:</div>
        <StatusTransitionButtons 
          lancamento={lancamento} 
          onUpdateStatus={onUpdateStatus}
          onRegistrarPagamento={onOpenRegistrarPagamento}
        />
      </div>
    </div>
  );
}

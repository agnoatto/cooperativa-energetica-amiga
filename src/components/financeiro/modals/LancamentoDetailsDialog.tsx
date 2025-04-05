
/**
 * Diálogo de detalhes do lançamento financeiro
 * 
 * Exibe informações detalhadas sobre o lançamento, com opções
 * para atualizar seu status. A data de vencimento é obtida
 * diretamente da fatura ou pagamento quando disponível.
 * Agora inclui o mês de referência para melhor identificação.
 */
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { useState } from "react";
import { useUpdateLancamentoStatus } from "@/hooks/lancamentos/useUpdateLancamentoStatus";
import { RegistrarPagamentoDialog } from "./RegistrarPagamentoDialog";
import { HistoricoStatusList } from "./HistoricoStatusList";
import { LancamentoHeader } from "./components/LancamentoHeader";
import { LancamentoInfoBasica } from "./components/LancamentoInfoBasica";
import { LancamentoOrigemInfo } from "./components/LancamentoOrigemInfo";
import { LancamentoStatusActions } from "./components/LancamentoStatusActions";

interface LancamentoDetailsDialogProps {
  lancamento: LancamentoFinanceiro | null;
  isOpen: boolean;
  onClose: () => void;
  onAfterStatusChange?: () => void;
  onOpenRegistrarPagamento?: () => void;
}

export function LancamentoDetailsDialog({
  lancamento,
  isOpen,
  onClose,
  onAfterStatusChange,
  onOpenRegistrarPagamento,
}: LancamentoDetailsDialogProps) {
  const [showRegistrarPagamento, setShowRegistrarPagamento] = useState(false);
  const { updateLancamentoStatus, registrarPagamento } = useUpdateLancamentoStatus();

  if (!lancamento) return null;

  const handlePagamentoSuccess = () => {
    setShowRegistrarPagamento(false);
    if (onAfterStatusChange) {
      onAfterStatusChange();
    }
    onClose();
  };

  const handleUpdateStatus = async (
    lanc: LancamentoFinanceiro, 
    newStatus: StatusLancamento, 
    options?: { 
      valorPago?: number;
      valorJuros?: number;
      valorDesconto?: number;
      observacao?: string;
    }
  ) => {
    let success = false;

    if (options && newStatus === 'pago') {
      success = await registrarPagamento(
        lanc,
        options.valorPago || lanc.valor,
        options.valorJuros || 0,
        options.valorDesconto || 0,
        new Date().toISOString(),
        options.observacao
      );
    } else {
      success = await updateLancamentoStatus(lanc, newStatus);
    }

    if (success && onAfterStatusChange) {
      onAfterStatusChange();
      onClose();
    }
  };

  const handleOpenRegistrarPagamento = () => {
    if (onOpenRegistrarPagamento) {
      onOpenRegistrarPagamento();
    } else {
      setShowRegistrarPagamento(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Lançamento</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <LancamentoHeader lancamento={lancamento} />

            <LancamentoInfoBasica lancamento={lancamento} />

            <LancamentoOrigemInfo lancamento={lancamento} />

            <Separator className="my-3" />

            <div>
              <h4 className="font-medium mb-2">Histórico de Status</h4>
              <HistoricoStatusList historico={lancamento.historico_status} />
            </div>

            <Separator className="my-3" />

            <LancamentoStatusActions 
              lancamento={lancamento} 
              onUpdateStatus={handleUpdateStatus}
              onOpenRegistrarPagamento={handleOpenRegistrarPagamento}
            />
          </div>
        </DialogContent>
      </Dialog>

      {!onOpenRegistrarPagamento && (
        <RegistrarPagamentoDialog
          lancamento={lancamento}
          isOpen={showRegistrarPagamento}
          onClose={() => setShowRegistrarPagamento(false)}
          onSuccess={handlePagamentoSuccess}
        />
      )}
    </>
  );
}

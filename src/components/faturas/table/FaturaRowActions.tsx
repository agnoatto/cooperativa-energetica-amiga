
import { Button } from "@/components/ui/button";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Eye, Trash2, CheckCircle2, RotateCw } from "lucide-react";
import { FaturaPdfButton } from "../FaturaPdfButton";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FaturaRowActionsProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onShowPaymentModal: () => void;
}

export function FaturaRowActions({
  fatura,
  onViewDetails,
  onDelete,
  onUpdateStatus,
  onShowPaymentModal,
}: FaturaRowActionsProps) {
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReenviarFatura = async () => {
    setErrorMessage(null);
    try {
      setIsProcessingAction(true);
      await onUpdateStatus(fatura, 'reenviada', 'Fatura reenviada após correção');
      toast.success('Fatura reenviada com sucesso');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao reenviar fatura';
      setErrorMessage(message);
      toast.error(message);
      console.error('Erro detalhado no reenvio:', error);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const actions = [];

  actions.push(
    <Button
      key="view"
      variant="outline"
      size="icon"
      onClick={() => onViewDetails(fatura)}
      title="Visualizar Detalhes"
    >
      <Eye className="h-4 w-4" />
    </Button>
  );

  if (fatura.status === 'corrigida') {
    actions.push(
      <Button
        key="resend"
        variant="outline"
        size="icon"
        onClick={handleReenviarFatura}
        title="Reenviar Fatura"
        disabled={isProcessingAction}
      >
        <RotateCw className="h-4 w-4" />
      </Button>
    );
  }

  if (['enviada', 'reenviada', 'atrasada'].includes(fatura.status)) {
    actions.push(
      <Button
        key="confirm"
        variant="outline"
        size="icon"
        onClick={onShowPaymentModal}
        title="Confirmar Pagamento"
        disabled={isProcessingAction}
      >
        <CheckCircle2 className="h-4 w-4" />
      </Button>
    );
  }

  if (fatura.status === 'gerada') {
    actions.push(
      <Button
        key="delete"
        variant="outline"
        size="icon"
        onClick={() => onDelete(fatura)}
        title="Excluir Fatura"
        disabled={isProcessingAction}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    );
  }

  actions.push(
    <FaturaPdfButton key="pdf" fatura={fatura} />
  );

  return (
    <>
      <div className="text-right space-x-2">
        {actions}
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
}

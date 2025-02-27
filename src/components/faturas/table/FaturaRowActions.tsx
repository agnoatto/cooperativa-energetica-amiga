
import { Button } from "@/components/ui/button";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Edit, Eye, Trash2, CheckCircle2, PenTool, RotateCw } from "lucide-react";
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
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onShowPaymentModal: () => void;
}

export function FaturaRowActions({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onShowPaymentModal,
}: FaturaRowActionsProps) {
  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [isProcessingCorrection, setIsProcessingCorrection] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCorrection = async () => {
    if (!motivo.trim()) {
      toast.error("Por favor, insira o motivo da correção");
      return;
    }

    setErrorMessage(null);
    try {
      setIsProcessingCorrection(true);
      await onUpdateStatus(fatura, 'corrigida', motivo);
      toast.success("Fatura marcada para correção com sucesso");
      setShowCorrectionDialog(false);
      setMotivo("");
      onEdit(fatura);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao corrigir fatura';
      setErrorMessage(message);
      toast.error(message);
      console.error('Erro detalhado na correção:', error);
    } finally {
      setIsProcessingCorrection(false);
    }
  };

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

  if (['gerada', 'pendente', 'corrigida'].includes(fatura.status)) {
    actions.push(
      <Button
        key="edit"
        variant="outline"
        size="icon"
        onClick={() => onEdit(fatura)}
        title="Editar Fatura"
        disabled={isProcessingAction}
      >
        <Edit className="h-4 w-4" />
      </Button>
    );
  }

  if (fatura.status === 'enviada') {
    actions.push(
      <Button
        key="correct"
        variant="outline"
        size="icon"
        onClick={() => setShowCorrectionDialog(true)}
        title="Corrigir Fatura"
        disabled={isProcessingAction}
      >
        <PenTool className="h-4 w-4" />
      </Button>
    );
  }

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

      <Dialog open={showCorrectionDialog} onOpenChange={setShowCorrectionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo da Correção</Label>
              <Textarea
                id="motivo"
                placeholder="Digite o motivo da correção"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCorrectionDialog(false);
                setErrorMessage(null);
              }}
              disabled={isProcessingCorrection}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCorrection}
              disabled={isProcessingCorrection}
            >
              {isProcessingCorrection ? "Processando..." : "Confirmar e Editar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

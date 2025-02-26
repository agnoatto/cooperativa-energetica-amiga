
import { Button } from "@/components/ui/button";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Edit, Eye, Trash2, Send, CheckCircle2, PenTool, RotateCw } from "lucide-react";
import { FaturaPdfButton } from "../FaturaPdfButton";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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

  const handleCorrection = async () => {
    if (!motivo.trim()) {
      toast.error("Por favor, insira o motivo da correção");
      return;
    }

    try {
      setIsProcessingCorrection(true);
      await onUpdateStatus(fatura, 'corrigida', motivo);
      setShowCorrectionDialog(false);
      setMotivo("");
      onEdit(fatura);
    } catch (error) {
      toast.error("Erro ao marcar fatura para correção");
      console.error('Erro na correção:', error);
    } finally {
      setIsProcessingCorrection(false);
    }
  };

  const handleSendFatura = async () => {
    try {
      setIsProcessingAction(true);
      await onUpdateStatus(fatura, 'enviada');
      toast.success('Fatura enviada com sucesso');
    } catch (error) {
      console.error('Erro ao enviar fatura:', error);
      toast.error('Erro ao enviar fatura');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleReenviarFatura = async () => {
    try {
      setIsProcessingAction(true);
      await onUpdateStatus(fatura, 'reenviada');
      toast.success('Fatura reenviada com sucesso');
    } catch (error) {
      console.error('Erro ao reenviar fatura:', error);
      toast.error('Erro ao reenviar fatura');
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

  if (fatura.status === 'pendente') {
    actions.push(
      <Button
        key="send"
        variant="outline"
        size="icon"
        onClick={handleSendFatura}
        title="Enviar Fatura"
        disabled={isProcessingAction}
      >
        <Send className="h-4 w-4" />
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
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCorrectionDialog(false)}
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

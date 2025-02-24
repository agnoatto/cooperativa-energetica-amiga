
import { Button } from "@/components/ui/button";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Edit, Eye, Trash2, Send, CheckCircle2, PenTool, RotateCw, Mail, Phone } from "lucide-react";
import { FaturaPdfButton } from "../FaturaPdfButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { DialogContent } from "@radix-ui/react-dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  const [isProcessingSend, setIsProcessingSend] = useState(false);

  const handleSendEmail = async () => {
    try {
      setIsProcessingSend(true);
      // TODO: Implementar envio por email
      await onUpdateStatus(fatura, 'enviada', 'Fatura enviada por email');
      toast.success("Fatura enviada por email com sucesso");
    } catch (error) {
      toast.error("Erro ao enviar email");
    } finally {
      setIsProcessingSend(false);
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      setIsProcessingSend(true);
      // TODO: Implementar envio por WhatsApp
      await onUpdateStatus(fatura, 'enviada', 'Fatura enviada por WhatsApp');
      toast.success("Fatura enviada por WhatsApp com sucesso");
    } catch (error) {
      toast.error("Erro ao enviar WhatsApp");
    } finally {
      setIsProcessingSend(false);
    }
  };

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
      toast.success("Fatura marcada para correção");
      // Após confirmar a correção, abre automaticamente o modal de edição
      onEdit(fatura);
    } catch (error) {
      toast.error("Erro ao marcar fatura para correção");
    } finally {
      setIsProcessingCorrection(false);
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

  // Permitir edição em status específicos
  if (['gerada', 'pendente', 'corrigida'].includes(fatura.status)) {
    actions.push(
      <Button
        key="edit"
        variant="outline"
        size="icon"
        onClick={() => onEdit(fatura)}
        title="Editar Fatura"
      >
        <Edit className="h-4 w-4" />
      </Button>
    );
  }

  // Botão de envio para faturas pendentes
  if (fatura.status === 'pendente') {
    actions.push(
      <DropdownMenu key="send">
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            title="Enviar Fatura"
            disabled={isProcessingSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleSendEmail} disabled={isProcessingSend}>
            <Mail className="mr-2 h-4 w-4" />
            Enviar por Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSendWhatsApp} disabled={isProcessingSend}>
            <Phone className="mr-2 h-4 w-4" />
            Enviar por WhatsApp
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Botão para iniciar correção
  if (fatura.status === 'enviada') {
    actions.push(
      <Button
        key="correct"
        variant="outline"
        size="icon"
        onClick={() => setShowCorrectionDialog(true)}
        title="Corrigir Fatura"
      >
        <PenTool className="h-4 w-4" />
      </Button>
    );
  }

  // Botão para reenviar após correção
  if (fatura.status === 'corrigida') {
    actions.push(
      <Button
        key="resend"
        variant="outline"
        size="icon"
        onClick={() => onUpdateStatus(fatura, 'reenviada', 'Fatura reenviada após correção')}
        title="Reenviar Fatura"
      >
        <RotateCw className="h-4 w-4" />
      </Button>
    );
  }

  // Confirmação de pagamento
  if (['enviada', 'reenviada', 'atrasada'].includes(fatura.status)) {
    actions.push(
      <Button
        key="confirm"
        variant="outline"
        size="icon"
        onClick={onShowPaymentModal}
        title="Confirmar Pagamento"
      >
        <CheckCircle2 className="h-4 w-4" />
      </Button>
    );
  }

  // Finalizar fatura
  if (fatura.status === 'paga') {
    actions.push(
      <Button
        key="finish"
        variant="outline"
        size="icon"
        onClick={() => onUpdateStatus(fatura, 'finalizada', 'Fatura finalizada - pagamento processado')}
        title="Finalizar Fatura"
      >
        <CheckCircle2 className="h-4 w-4" />
      </Button>
    );
  }

  // Permitir exclusão apenas de faturas recém geradas
  if (fatura.status === 'gerada') {
    actions.push(
      <Button
        key="delete"
        variant="outline"
        size="icon"
        onClick={() => onDelete(fatura)}
        title="Excluir Fatura"
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

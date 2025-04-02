
/**
 * Componente para o conteúdo do menu de ações da fatura
 * 
 * Este componente renderiza o conteúdo do menu popup com as ações disponíveis para uma fatura.
 * Otimizado para funcionar com o componente Popover.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import { ActionMenuItem } from "./ActionMenuItem";
import { Eye, Edit, FileText, Trash2, CheckCircle2, RotateCw } from "lucide-react";

interface ActionsMenuContentProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onReenviarFatura: () => Promise<void>;
  onShowPaymentModal: () => void;
  onViewConcessionaria: () => void;
  onViewRelatorio: () => void;
  isGeneratingPdf: boolean;
  onClose: () => void;
}

export function ActionsMenuContent({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onReenviarFatura,
  onShowPaymentModal,
  onViewConcessionaria,
  onViewRelatorio,
  isGeneratingPdf,
  onClose
}: ActionsMenuContentProps) {
  return (
    <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
      <ActionMenuItem
        icon={<Eye className="h-4 w-4" />}
        label="Visualizar"
        onClick={() => {
          onViewDetails(fatura);
          onClose();
        }}
      />
      
      <ActionMenuItem
        icon={<Edit className="h-4 w-4" />}
        label="Editar"
        onClick={() => {
          onEdit(fatura);
          onClose();
        }}
      />
      
      {fatura.status === 'corrigida' && (
        <ActionMenuItem
          icon={<RotateCw className="h-4 w-4" />}
          label="Reenviar"
          onClick={onReenviarFatura}
        />
      )}
      
      {['enviada', 'reenviada', 'atrasada'].includes(fatura.status) && (
        <ActionMenuItem
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Confirmar Pagamento"
          onClick={() => {
            onShowPaymentModal();
            onClose();
          }}
        />
      )}
      
      {fatura.status === 'pendente' && (
        <ActionMenuItem
          icon={<Trash2 className="h-4 w-4" />}
          label="Excluir"
          variant="ghost"
          onClick={() => {
            onDelete(fatura);
            onClose();
          }}
        />
      )}
      
      {fatura.arquivo_concessionaria_path && (
        <ActionMenuItem
          icon={<FileText className="h-4 w-4" />}
          label="Ver Fatura Concessionária"
          onClick={onViewConcessionaria}
        />
      )}
      
      <ActionMenuItem
        icon={<FileText className="h-4 w-4" />}
        label={isGeneratingPdf ? "Gerando relatório..." : "Ver Relatório Mensal"}
        onClick={onViewRelatorio}
        disabled={isGeneratingPdf}
      />
    </div>
  );
}

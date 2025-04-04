
/**
 * Menu de ações para faturas
 * 
 * Este componente exibe um menu de ações contextuais para uma fatura,
 * permitindo operações como visualizar, editar, excluir e gerar relatórios.
 * Usa Popover em vez de DropdownMenu para melhor desempenho.
 * Ações de pagamento foram removidas conforme novo fluxo, ficando exclusivamente no módulo Financeiro.
 */
import React, { useState } from "react";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { MoreVertical } from "lucide-react";
import { PdfVisualizationHandler } from "./components/PdfVisualizationHandler";
import { ActionsMenuContent } from "./components/ActionsMenuContent";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { PdfPreview } from "../upload/PdfPreview";

interface FaturaActionsMenuProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturaActionsMenu({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus
}: FaturaActionsMenuProps) {
  const [open, setOpen] = useState(false);
  
  // Usar o handler para gerenciar visualização de PDFs
  const {
    showPdfPreview,
    pdfBlobUrl,
    isConcessionariaPreview,
    isGeneratingPdf,
    handleViewConcessionaria,
    handleViewRelatorio,
    handleClosePdfPreview
  } = PdfVisualizationHandler({ fatura });
  
  const handleReenviarFatura = async () => {
    try {
      await onUpdateStatus(fatura, 'reenviada', 'Fatura reenviada após correção');
      setOpen(false);
    } catch (error) {
      console.error('Erro ao reenviar fatura:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            aria-label="Abrir menu de ações"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" alignOffset={5} className="w-52 p-1 shadow-md">
          <ActionsMenuContent 
            fatura={fatura}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
            onReenviarFatura={handleReenviarFatura}
            onViewConcessionaria={handleViewConcessionaria}
            onViewRelatorio={handleViewRelatorio}
            isGeneratingPdf={isGeneratingPdf}
            onClose={handleClose}
          />
        </PopoverContent>
      </Popover>

      {/* Visualizador de PDF */}
      <PdfPreview
        isOpen={showPdfPreview}
        onClose={handleClosePdfPreview}
        pdfUrl={isConcessionariaPreview ? fatura.arquivo_concessionaria_path : pdfBlobUrl}
        title={isConcessionariaPreview ? "Fatura da Concessionária" : "Relatório Mensal"}
        isRelatorio={!isConcessionariaPreview}
      />
    </div>
  );
}

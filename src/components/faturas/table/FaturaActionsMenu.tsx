
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleReenviarFatura = async () => {
    try {
      await onUpdateStatus(fatura, 'reenviada', 'Fatura reenviada após correção');
      setOpen(false);
    } catch (error) {
      console.error('Erro ao reenviar fatura:', error);
    }
  };

  const handleViewConcessionaria = () => {
    // Implementado via PdfVisualizationHandler
    console.log("Solicitação para visualizar fatura da concessionária");
    setOpen(false);
  };

  const handleViewRelatorio = () => {
    // Implementado via PdfVisualizationHandler
    setIsGeneratingPdf(true);
    console.log("Solicitação para visualizar relatório mensal");
    
    // Simular finalização da geração para atualizar o estado
    setTimeout(() => {
      setIsGeneratingPdf(false);
      setOpen(false);
    }, 100);
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

      {/* Manipulador de visualização de PDF */}
      <PdfVisualizationHandler fatura={fatura} />
    </div>
  );
}

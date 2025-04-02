
/**
 * Menu de ações para faturas
 * 
 * Este componente exibe um menu de ações contextuais para uma fatura,
 * permitindo operações como visualizar, editar, excluir e gerar relatórios.
 */
import React, { useRef, useState, useEffect } from "react";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { MoreVertical } from "lucide-react";
import { createPortal } from "react-dom";
import { PdfVisualizationHandler } from "./components/PdfVisualizationHandler";
import { ActionsMenuContent } from "./components/ActionsMenuContent";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface FaturaActionsMenuProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onShowPaymentModal: () => void;
}

export function FaturaActionsMenu({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onShowPaymentModal
}: FaturaActionsMenuProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const handleReenviarFatura = async () => {
    try {
      await onUpdateStatus(fatura, 'reenviada', 'Fatura reenviada após correção');
    } catch (error) {
      console.error('Erro ao reenviar fatura:', error);
    }
  };

  const handleViewConcessionaria = () => {
    // Implementado via PdfVisualizationHandler
    console.log("Solicitação para visualizar fatura da concessionária");
  };

  const handleViewRelatorio = () => {
    // Implementado via PdfVisualizationHandler
    setIsGeneratingPdf(true);
    console.log("Solicitação para visualizar relatório mensal");
    
    // Simular finalização da geração para atualizar o estado
    setTimeout(() => setIsGeneratingPdf(false), 100);
  };

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            aria-label="Abrir menu de ações"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <ActionsMenuContent 
            fatura={fatura}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
            onReenviarFatura={handleReenviarFatura}
            onShowPaymentModal={onShowPaymentModal}
            onViewConcessionaria={handleViewConcessionaria}
            onViewRelatorio={handleViewRelatorio}
            isGeneratingPdf={isGeneratingPdf}
            onClose={() => {}}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Manipulador de visualização de PDF */}
      <PdfVisualizationHandler fatura={fatura} />
    </div>
  );
}

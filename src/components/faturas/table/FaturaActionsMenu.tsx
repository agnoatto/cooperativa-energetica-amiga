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
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Componente PdfVisualizationHandler é referenciado indiretamente
  // para lidar com a visualização de PDFs

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleScroll() {
      if (isOpen) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      const menuHeight = 200;
      const menuWidth = 180;
      
      let top = rect.bottom + 5;
      let left = rect.left;
      
      if (top + menuHeight > viewportHeight) {
        top = rect.top - menuHeight - 5;
      }
      
      if (left + menuWidth > viewportWidth) {
        left = rect.right - menuWidth;
      }
      
      setPosition({ top, left });
    }
    
    setIsOpen(!isOpen);
  };

  const handleReenviarFatura = async () => {
    try {
      await onUpdateStatus(fatura, 'reenviada', 'Fatura reenviada após correção');
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao reenviar fatura:', error);
    }
  };

  const handleViewConcessionaria = () => {
    // Implementado via PdfVisualizationHandler
    console.log("Solicitação para visualizar fatura da concessionária");
    setIsOpen(false);
  };

  const handleViewRelatorio = () => {
    // Implementado via PdfVisualizationHandler
    setIsGeneratingPdf(true);
    console.log("Solicitação para visualizar relatório mensal");
    setIsOpen(false);
    
    // Simular finalização da geração para atualizar o estado
    setTimeout(() => setIsGeneratingPdf(false), 100);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        aria-label="Abrir menu de ações"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="fixed z-50 min-w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in-50 zoom-in-95"
          style={{ 
            top: `${position.top}px`, 
            left: `${position.left}px`,
          }}
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
        >
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
            onClose={() => setIsOpen(false)}
          />
        </div>,
        document.body
      )}

      {/* Manipulador de visualização de PDF */}
      <PdfVisualizationHandler fatura={fatura} />
    </div>
  );
}

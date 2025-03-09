import React, { useRef, useState, useEffect } from "react";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Eye, Edit, FileText, Trash2, CheckCircle2, RotateCw, MoreVertical } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { PdfPreview } from "../upload/PdfPreview";
import { pdf } from "@react-pdf/renderer";
import { FaturaPDF } from "../pdf/FaturaPDF";

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
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isConcessionariaPreview, setIsConcessionariaPreview] = useState(false);

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

  useEffect(() => {
    return () => {
      if (pdfBlobUrl && pdfBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

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
    if (!fatura.arquivo_concessionaria_path) {
      toast.error("Nenhum arquivo de fatura disponível");
      return;
    }
    
    console.log("Visualizando fatura da concessionária:", fatura.arquivo_concessionaria_path);
    setIsConcessionariaPreview(true);
    setShowPdfPreview(true);
    setIsOpen(false);
  };

  const handleViewRelatorio = async () => {
    setIsGeneratingPdf(true);
    setIsOpen(false);
    
    try {
      if (!fatura || !fatura.unidade_beneficiaria) {
        toast.error("Dados da fatura incompletos");
        return;
      }
      
      console.log("Gerando PDF do relatório mensal");
      const blob = await pdf(<FaturaPDF fatura={fatura} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      setPdfBlobUrl(url);
      setIsConcessionariaPreview(false);
      setShowPdfPreview(true);
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      toast.error(`Erro ao gerar PDF: ${error.message}`);
    } finally {
      setIsGeneratingPdf(false);
    }
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
          <div className="py-1" role="none">
            <button
              className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onViewDetails(fatura);
                setIsOpen(false);
              }}
              role="menuitem"
            >
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </button>
            
            <button
              className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onEdit(fatura);
                setIsOpen(false);
              }}
              role="menuitem"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </button>
            
            {fatura.status === 'corrigida' && (
              <button
                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleReenviarFatura}
                role="menuitem"
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Reenviar
              </button>
            )}
            
            {['enviada', 'reenviada', 'atrasada'].includes(fatura.status) && (
              <button
                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onShowPaymentModal();
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirmar Pagamento
              </button>
            )}
            
            {fatura.status === 'gerada' && (
              <button
                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onDelete(fatura);
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </button>
            )}
            
            {fatura.arquivo_concessionaria_path && (
              <button
                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleViewConcessionaria}
                role="menuitem"
              >
                <FileText className="mr-2 h-4 w-4" />
                Ver Fatura Concessionária
              </button>
            )}
            
            <button
              className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleViewRelatorio}
              disabled={isGeneratingPdf}
              role="menuitem"
            >
              <FileText className="mr-2 h-4 w-4" />
              {isGeneratingPdf ? "Gerando relatório..." : "Ver Relatório Mensal"}
            </button>
          </div>
        </div>,
        document.body
      )}

      <PdfPreview
        isOpen={showPdfPreview}
        onClose={() => {
          console.log("Fechando previsualização PDF");
          setShowPdfPreview(false);
          if (pdfBlobUrl && pdfBlobUrl.startsWith('blob:')) {
            URL.revokeObjectURL(pdfBlobUrl);
            setPdfBlobUrl(null);
          }
        }}
        pdfUrl={isConcessionariaPreview ? fatura.arquivo_concessionaria_path : pdfBlobUrl}
        title={isConcessionariaPreview ? "Fatura da Concessionária" : "Relatório Mensal"}
        isRelatorio={!isConcessionariaPreview}
      />
    </div>
  );
}

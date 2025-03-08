
import React, { useRef, useState, useEffect } from "react";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Eye, Edit, FileText, Trash2, CheckCircle2, RotateCw, MoreVertical } from "lucide-react";

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
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
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

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        aria-label="Abrir menu de ações"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 z-10 mt-1 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <button
              className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onViewDetails(fatura);
                setIsOpen(false);
              }}
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
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </button>
            
            {fatura.status === 'corrigida' && (
              <button
                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  handleReenviarFatura();
                  setIsOpen(false);
                }}
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
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </button>
            )}
            
            <button
              className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                window.open(`/faturas/pdf/${fatura.id}`, '_blank');
                setIsOpen(false);
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

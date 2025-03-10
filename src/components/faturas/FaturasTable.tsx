
/**
 * Componente principal da tabela de faturas
 * 
 * Este componente exibe a lista de faturas e gerencia as interações
 * como visualizar detalhes, editar, excluir e atualizar status.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { FaturasLoadingState } from "./table/FaturasLoadingState";
import { FaturasEmptyState } from "./table/FaturasEmptyState";
import { FaturaDetailsDialog } from "./FaturaDetailsDialog";
import { DeleteFaturaDialog } from "./DeleteFaturaDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { FaturasMobileList } from "./table/mobile/FaturasMobileList";
import { FaturasDesktopTable } from "./table/desktop/FaturasDesktopTable";
import { EditFaturaModal } from "./EditFaturaModal";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";
import { UpdateFaturaInput } from "@/hooks/faturas/types/updateFatura";

interface FaturasTableProps {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
  onDeleteFatura: (id: string) => Promise<void>;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onUpdateFatura: (data: UpdateFaturaInput) => Promise<Fatura>;
  refetchFaturas?: () => void;
}

export function FaturasTable({
  faturas,
  isLoading,
  onDeleteFatura,
  onUpdateStatus,
  onUpdateFatura,
  refetchFaturas
}: FaturasTableProps) {
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [faturaToDelete, setFaturaToDelete] = useState<Fatura | null>(null);
  const [faturaToEdit, setFaturaToEdit] = useState<Fatura | null>(null);
  const [faturaToConfirmPayment, setFaturaToConfirmPayment] = useState<Fatura | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const isMobile = useIsMobile();

  const handleDeleteConfirm = async () => {
    if (!faturaToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDeleteFatura(faturaToDelete.id);
    } finally {
      setIsDeleting(false);
      setFaturaToDelete(null);
    }
  };

  const handleUpdateFatura = async (data: UpdateFaturaInput) => {
    setIsUpdating(true);
    try {
      await onUpdateFatura(data);
    } catch (error) {
      console.error("Erro ao atualizar fatura:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleShowPaymentConfirmation = (fatura: Fatura) => {
    setFaturaToConfirmPayment(fatura);
  };

  const handleConfirmPayment = async (data: { 
    id: string; 
    data_pagamento: string; 
    valor_adicional: number; 
    observacao_pagamento: string | null; 
  }) => {
    await onUpdateStatus(
      faturaToConfirmPayment!,
      'paga',
      data.observacao_pagamento || undefined
    );
    setFaturaToConfirmPayment(null);
  };

  if (isLoading) {
    return <FaturasLoadingState />;
  }

  if (!faturas || faturas.length === 0) {
    return <FaturasEmptyState />;
  }

  const TableComponent = isMobile ? FaturasMobileList : FaturasDesktopTable;

  return (
    <>
      <TableComponent
        faturas={faturas}
        onViewDetails={setSelectedFatura}
        onEdit={setFaturaToEdit}
        onDelete={setFaturaToDelete}
        onUpdateStatus={onUpdateStatus}
        onShowPaymentConfirmation={handleShowPaymentConfirmation}
      />

      {selectedFatura && (
        <FaturaDetailsDialog
          fatura={selectedFatura}
          isOpen={!!selectedFatura}
          onClose={() => setSelectedFatura(null)}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      {faturaToDelete && (
        <DeleteFaturaDialog
          fatura={faturaToDelete}
          isOpen={!!faturaToDelete}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setFaturaToDelete(null)}
        />
      )}

      {faturaToEdit && (
        <EditFaturaModal
          fatura={faturaToEdit}
          isOpen={!!faturaToEdit}
          onClose={() => setFaturaToEdit(null)}
          onSave={handleUpdateFatura}
          isProcessing={isUpdating}
          refetchFaturas={refetchFaturas}
        />
      )}
      
      {faturaToConfirmPayment && (
        <PaymentConfirmationModal
          fatura={faturaToConfirmPayment}
          isOpen={!!faturaToConfirmPayment}
          onConfirm={handleConfirmPayment}
          onClose={() => setFaturaToConfirmPayment(null)}
        />
      )}
    </>
  );
}

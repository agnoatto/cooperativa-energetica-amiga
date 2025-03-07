
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
import { UpdateFaturaInput } from "@/hooks/faturas/useUpdateFatura";

interface FaturasTableProps {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
  onDeleteFatura: (id: string) => Promise<void>;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onUpdateFatura: (data: UpdateFaturaInput) => Promise<void>;
}

export function FaturasTable({
  faturas,
  isLoading,
  onDeleteFatura,
  onUpdateStatus,
  onUpdateFatura
}: FaturasTableProps) {
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [faturaToDelete, setFaturaToDelete] = useState<Fatura | null>(null);
  const [faturaToEdit, setFaturaToEdit] = useState<Fatura | null>(null);
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
      // Aguardamos o resultado da atualização antes de fechar o modal
      await onUpdateFatura(data);
      // O modal será fechado pelo próprio componente EditFaturaModal após sucesso
    } catch (error) {
      console.error("Erro ao atualizar fatura:", error);
    } finally {
      setIsUpdating(false);
    }
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
      />

      {selectedFatura && (
        <FaturaDetailsDialog
          fatura={selectedFatura}
          isOpen={!!selectedFatura}
          onClose={() => setSelectedFatura(null)}
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
        />
      )}
    </>
  );
}


import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { FaturasLoadingState } from "./table/FaturasLoadingState";
import { FaturasEmptyState } from "./table/FaturasEmptyState";
import { FaturaDetailsDialog } from "./FaturaDetailsDialog";
import { DeleteFaturaDialog } from "./DeleteFaturaDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { FaturasMobileList } from "./table/mobile/FaturasMobileList";
import { FaturasDesktopTable } from "./table/desktop/FaturasDesktopTable";

interface FaturasTableProps {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
  onDeleteFatura: (id: string) => Promise<void>;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturasTable({
  faturas,
  isLoading,
  onDeleteFatura,
  onUpdateStatus
}: FaturasTableProps) {
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [faturaToDelete, setFaturaToDelete] = useState<Fatura | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
    </>
  );
}

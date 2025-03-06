
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
  onViewDetails: (fatura: Fatura) => void;
  onDeleteFatura: (id: string) => Promise<void>;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onCriarCobranca?: (fatura: Fatura) => void; // Add this parameter
}

export function FaturasTable({
  faturas,
  isLoading,
  onViewDetails,
  onDeleteFatura,
  onUpdateStatus,
  onCriarCobranca // Add this parameter
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

  return (
    <>
      {isMobile ? (
        <FaturasMobileList
          faturas={faturas}
          onViewDetails={setSelectedFatura}
          onDelete={setFaturaToDelete}
          onUpdateStatus={onUpdateStatus}
          onCriarCobranca={onCriarCobranca} // Pass this to mobile list
        />
      ) : (
        <FaturasDesktopTable
          faturas={faturas}
          onViewDetails={setSelectedFatura}
          onDelete={setFaturaToDelete}
          onUpdateStatus={onUpdateStatus}
          onCriarCobranca={onCriarCobranca} // Pass this to desktop table
        />
      )}

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

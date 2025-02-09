
import { Table, TableBody } from "@/components/ui/table";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { FaturasTableHeader } from "./table/FaturasTableHeader";
import { FaturaTableRow } from "./table/FaturaTableRow";
import { FaturasLoadingState } from "./table/FaturasLoadingState";
import { FaturasEmptyState } from "./table/FaturasEmptyState";
import { FaturaDetailsDialog } from "./FaturaDetailsDialog";
import { DeleteFaturaDialog } from "./DeleteFaturaDialog";

interface FaturasTableProps {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
  onEditFatura: (fatura: Fatura) => void;
  onDeleteFatura: (id: string) => Promise<void>;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturasTable({
  faturas,
  isLoading,
  onEditFatura,
  onDeleteFatura,
  onUpdateStatus
}: FaturasTableProps) {
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [faturaToDelete, setFaturaToDelete] = useState<Fatura | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <FaturasTableHeader />
          {isLoading ? (
            <FaturasLoadingState />
          ) : faturas && faturas.length > 0 ? (
            <TableBody>
              {faturas.map((fatura) => (
                <FaturaTableRow
                  key={fatura.id}
                  fatura={fatura}
                  onViewDetails={setSelectedFatura}
                  onEdit={onEditFatura}
                  onDelete={setFaturaToDelete}
                  onUpdateStatus={onUpdateStatus}
                />
              ))}
            </TableBody>
          ) : (
            <FaturasEmptyState />
          )}
        </Table>
      </div>

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

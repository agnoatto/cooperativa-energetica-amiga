
import { Table, TableBody } from "@/components/ui/table";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { FaturasTableHeader } from "./table/FaturasTableHeader";
import { FaturaTableRow } from "./table/FaturaTableRow";
import { FaturasLoadingState } from "./table/FaturasLoadingState";
import { FaturasEmptyState } from "./table/FaturasEmptyState";
import { FaturaDetailsDialog } from "./FaturaDetailsDialog";
import { DeleteFaturaDialog } from "./DeleteFaturaDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash } from "lucide-react";
import { formatarMoeda } from "@/utils/formatters";

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

  const getStatusColor = (status: FaturaStatus) => {
    switch (status) {
      case 'pendente':
      case 'enviada':
        return 'bg-yellow-100 text-yellow-800';
      case 'paga':
      case 'finalizada':
        return 'bg-green-100 text-green-800';
      case 'atrasada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <FaturasLoadingState />;
  }

  if (!faturas || faturas.length === 0) {
    return <FaturasEmptyState />;
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {faturas.map((fatura) => (
          <div
            key={fatura.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">
                  UC: {fatura.unidade_beneficiaria.numero_uc}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {fatura.unidade_beneficiaria.cooperado.nome}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(fatura.status)}`}>
                {fatura.status.charAt(0).toUpperCase() + fatura.status.slice(1)}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500">Competência:</span>
                <span>{`${fatura.mes}/${fatura.ano}`}</span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500">Consumo:</span>
                <span>{fatura.consumo_kwh} kWh</span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500">Valor Desconto:</span>
                <span>{formatarMoeda(fatura.valor_desconto)}</span>
              </div>

              <div className="grid grid-cols-2 gap-1 pt-2 border-t border-gray-100 mt-2">
                <span className="text-gray-900 font-medium">Valor Total:</span>
                <span className="text-gray-900 font-medium">
                  {formatarMoeda(fatura.valor_total)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFatura(fatura)}
                className="h-10 w-10 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditFatura(fatura)}
                className="h-10 w-10 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFaturaToDelete(fatura)}
                className="h-10 w-10 p-0"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

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
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <FaturasTableHeader />
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

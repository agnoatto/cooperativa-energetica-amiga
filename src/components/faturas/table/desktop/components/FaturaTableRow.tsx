
/**
 * Componente de linha da tabela de faturas
 * 
 * Este componente renderiza uma linha completa da tabela de faturas,
 * incluindo todas as células necessárias conforme as colunas visíveis.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Column } from "@/components/ui/excel-table/types";
import { TableCellContent } from "./TableCellContent";

interface FaturaTableRowProps {
  fatura: Fatura;
  filteredColumns: Column[];
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onViewPdf: () => void;
}

export function FaturaTableRow({
  fatura,
  filteredColumns,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onViewPdf
}: FaturaTableRowProps) {
  return (
    <tr key={fatura.id} className="border-b hover:bg-gray-50 transition-colors text-sm">
      {filteredColumns.map((column, colIndex) => (
        <TableCellContent
          key={column.id}
          columnId={column.id}
          fatura={fatura}
          colIndex={colIndex}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
          onViewPdf={onViewPdf}
        />
      ))}
    </tr>
  );
}

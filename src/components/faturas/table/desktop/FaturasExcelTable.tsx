
/**
 * Componente de tabela no estilo Excel para faturas
 * 
 * Este componente oferece uma experiência similar ao Excel para visualização
 * de faturas, com recursos como redimensionamento de colunas, personalização
 * de colunas visíveis e formatação de dados.
 */
import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { ColumnSettings } from "@/components/ui/excel-table/ColumnSettings";
import { useTableColumns } from "./hooks/useTableColumns";
import { defaultColumns } from "./config/defaultColumns";
import { FaturaTableRow } from "./components/FaturaTableRow";
import { useMemo } from "react";

interface FaturasExcelTableProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onViewPdf: () => void;
}

export function FaturasExcelTable({
  faturas,
  onViewDetails,
  onDelete,
  onEdit,
  onUpdateStatus,
  onViewPdf
}: FaturasExcelTableProps) {
  const {
    visibleColumns,
    columnWidths,
    filteredColumns,
    handleColumnVisibilityChange,
    handleResetColumns,
    handleColumnResize
  } = useTableColumns({
    defaultColumns,
    storageKeyPrefix: 'faturas'
  });

  // Preparar as linhas da tabela como um array de ReactNodes
  const tableRows = useMemo(() => {
    return faturas.map((fatura) => (
      <FaturaTableRow
        key={fatura.id}
        fatura={fatura}
        filteredColumns={filteredColumns}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        onDelete={onDelete}
        onUpdateStatus={onUpdateStatus}
        onViewPdf={onViewPdf}
      />
    ));
  }, [faturas, filteredColumns, onViewDetails, onEdit, onDelete, onUpdateStatus, onViewPdf]);

  return (
    <div className="overflow-hidden">
      <div className="flex justify-end mb-2">
        <ColumnSettings
          columns={defaultColumns}
          visibleColumns={visibleColumns}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          onReset={handleResetColumns}
        />
      </div>
      
      <ExcelTable
        columns={filteredColumns}
        rows={tableRows}
        storageKey="faturas-table-config"
        stickyHeader
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onResetColumns={handleResetColumns}
        onColumnResize={handleColumnResize}
      />
    </div>
  );
}

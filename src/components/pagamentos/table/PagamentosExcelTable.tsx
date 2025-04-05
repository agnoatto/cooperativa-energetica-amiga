
/**
 * Componente de tabela Excel para Pagamentos
 * 
 * Implementa o padrão de tabela estilo Excel com recursos avançados como
 * redimensionamento de colunas, cabeçalhos fixos e gerenciamento de visibilidade
 * de colunas para a listagem de pagamentos.
 */
import { useMemo } from "react";
import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import { ColumnSettings } from "@/components/ui/excel-table/ColumnSettings";
import { useTableColumns } from "./hooks/useTableColumns";
import { PagamentoData } from "../types/pagamento";
import { defaultColumns } from "./config/defaultColumns";
import { PagamentoExcelRow } from "./PagamentoExcelRow";
import { PagamentosLoadingState } from "./PagamentosLoadingState";
import { PagamentosEmptyState } from "./PagamentosEmptyState";

interface PagamentosExcelTableProps {
  pagamentos: PagamentoData[];
  isLoading: boolean;
  onViewDetails: (pagamento: PagamentoData) => void;
  onEditPagamento: (pagamento: PagamentoData) => void;
  onDeletePagamento: (pagamento: PagamentoData) => void;
}

export function PagamentosExcelTable({
  pagamentos,
  isLoading,
  onViewDetails,
  onEditPagamento,
  onDeletePagamento
}: PagamentosExcelTableProps) {
  const {
    visibleColumns,
    filteredColumns,
    handleColumnVisibilityChange,
    handleResetColumns,
    handleColumnResize
  } = useTableColumns();

  // Preparar as linhas da tabela
  const tableRows = useMemo(() => {
    return pagamentos.map((pagamento) => (
      <PagamentoExcelRow 
        key={pagamento.id}
        pagamento={pagamento}
        columns={filteredColumns}
        onViewDetails={onViewDetails}
        onEdit={onEditPagamento}
        onDelete={onDeletePagamento}
      />
    ));
  }, [pagamentos, filteredColumns, onViewDetails, onEditPagamento, onDeletePagamento]);

  if (isLoading) {
    return <PagamentosLoadingState />;
  }

  if (!pagamentos?.length) {
    return <PagamentosEmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnSettings
          columns={defaultColumns}
          visibleColumns={visibleColumns}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          onReset={handleResetColumns}
        />
      </div>
      
      <div className="border border-gray-200 rounded-md shadow-sm bg-white">
        <div className="h-[calc(100vh-360px)] w-full overflow-auto">
          <ExcelTable
            columns={filteredColumns}
            rows={tableRows}
            storageKey="pagamentos-table-settings"
            onColumnResize={handleColumnResize}
            stickyHeader
          />
        </div>
      </div>
    </div>
  );
}

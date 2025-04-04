
/**
 * Tabela de lançamentos financeiros estilo Excel
 * 
 * Esta tabela implementa a visualização de lançamentos financeiros
 * com recursos avançados como redimensionamento de colunas, cabeçalhos fixos
 * e outras funcionalidades inspiradas no Excel para melhor experiência do usuário.
 */
import { useState } from "react";
import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import { ColumnSettings } from "@/components/ui/excel-table/ColumnSettings";
import { useTableColumns } from "./hooks/useTableColumns";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { defaultColumns } from "./config/defaultColumns";
import { LancamentoExcelRow } from "./LancamentoExcelRow";
import { EmptyTableState } from "./components/EmptyTableState";
import { LoadingTableState } from "./components/LoadingTableState";
import { LancamentoDetailsDialog } from "../modals/LancamentoDetailsDialog";

interface LancamentosExcelTableProps {
  lancamentos: LancamentoFinanceiro[] | undefined;
  isLoading: boolean;
  tipo: "receita" | "despesa";
  refetch?: () => void;
}

export function LancamentosExcelTable({
  lancamentos,
  isLoading,
  tipo,
  refetch,
}: LancamentosExcelTableProps) {
  const [selectedLancamento, setSelectedLancamento] = useState<LancamentoFinanceiro | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    visibleColumns,
    filteredColumns,
    handleColumnVisibilityChange,
    handleResetColumns,
    handleColumnResize
  } = useTableColumns({
    storageKeyPrefix: 'lancamentos',
    tipoLancamento: tipo
  });

  const handleViewDetails = (lancamento: LancamentoFinanceiro) => {
    setSelectedLancamento(lancamento);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedLancamento(null);
  };

  if (isLoading) {
    return <LoadingTableState />;
  }

  if (!lancamentos || lancamentos.length === 0) {
    return <EmptyTableState />;
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
            storageKey={`lancamentos-${tipo}-table-settings`}
            onColumnResize={handleColumnResize}
            stickyHeader
          >
            <tbody>
              {lancamentos.map((lancamento) => (
                <LancamentoExcelRow 
                  key={lancamento.id}
                  lancamento={lancamento}
                  columns={filteredColumns}
                  tipo={tipo}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </tbody>
          </ExcelTable>
        </div>
      </div>

      <LancamentoDetailsDialog
        lancamento={selectedLancamento}
        isOpen={showDetails}
        onClose={handleCloseDetails}
        onAfterStatusChange={refetch}
      />
    </div>
  );
}

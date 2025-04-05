
/**
 * Tabela Excel para lançamentos financeiros
 * 
 * Este componente renderiza uma tabela estilo Excel para exibir lançamentos financeiros,
 * com suporte a resizing de colunas e melhor desempenho para grandes conjuntos de dados.
 */
import { LancamentoFinanceiro } from "@/types/financeiro";
import { ExcelTable } from "@/components/ui/excel-table/ExcelTable";
import { useMemo, useState } from "react";
import { LancamentoExcelRow } from "./LancamentoExcelRow";
import { useTableColumns } from "./hooks/useTableColumns";
import { LancamentoDetailsDialog } from "../modals/LancamentoDetailsDialog";
import { RegistrarPagamentoDialog } from "../modals/RegistrarPagamentoDialog";

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
  const { 
    columns, 
    visibleColumns, 
    columnWidths, 
    handleColumnVisibilityChange, 
    handleResetColumns, 
    handleColumnResize 
  } = useTableColumns({ tipoLancamento: tipo });
  
  const [selectedLancamento, setSelectedLancamento] = useState<LancamentoFinanceiro | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRegistrarPagamento, setShowRegistrarPagamento] = useState(false);

  const handleViewDetails = (lancamento: LancamentoFinanceiro) => {
    setSelectedLancamento(lancamento);
    setShowDetails(true);
  };

  const handleRegistrarPagamento = (lancamento: LancamentoFinanceiro) => {
    setSelectedLancamento(lancamento);
    setShowRegistrarPagamento(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedLancamento(null);
  };
  
  const handleCloseRegistrarPagamento = () => {
    setShowRegistrarPagamento(false);
  };

  const handlePagamentoSuccess = () => {
    setShowRegistrarPagamento(false);
    if (refetch) {
      refetch();
    }
  };

  const rows = useMemo(() => {
    if (!lancamentos) return [];
    
    return lancamentos.map((lancamento) => (
      <LancamentoExcelRow
        key={lancamento.id}
        lancamento={lancamento}
        columns={columns}
        tipo={tipo}
        onViewDetails={handleViewDetails}
        onRegistrarPagamento={handleRegistrarPagamento}
      />
    ));
  }, [lancamentos, columns, tipo]);

  return (
    <>
      <ExcelTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        emptyState={
          <div className="py-6 text-center">
            <p className="text-gray-500">Nenhum lançamento encontrado</p>
          </div>
        }
        loadingState={
          <div className="py-6 text-center">
            <p className="text-gray-500">Carregando lançamentos...</p>
          </div>
        }
        storageKey={`lancamentos-${tipo}-excel-table`}
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onResetColumns={handleResetColumns}
        onColumnResize={handleColumnResize}
      />

      <LancamentoDetailsDialog
        lancamento={selectedLancamento}
        isOpen={showDetails}
        onClose={handleCloseDetails}
        onAfterStatusChange={refetch}
        onOpenRegistrarPagamento={() => {
          setShowDetails(false);
          setShowRegistrarPagamento(true);
        }}
      />

      {selectedLancamento && (
        <RegistrarPagamentoDialog
          lancamento={selectedLancamento}
          isOpen={showRegistrarPagamento}
          onClose={handleCloseRegistrarPagamento}
          onSuccess={handlePagamentoSuccess}
        />
      )}
    </>
  );
}

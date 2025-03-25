
/**
 * Tabela de lançamentos financeiros
 * 
 * Este componente renderiza uma tabela com todos os lançamentos financeiros
 * de um determinado tipo (receita ou despesa). Inclui informações como
 * descrição, valor, status, data de vencimento e ações.
 * Exibe o mês de referência das faturas para facilitar identificação.
 */
import { LancamentoFinanceiro } from "@/types/financeiro";
import { useState } from "react";
import { LancamentoDetailsDialog } from "../modals/LancamentoDetailsDialog";
import { Table, TableBody } from "@/components/ui/table";
import { ptBR } from "date-fns/locale";
import { TableHeader } from "./components/TableHeader";
import { TableRow } from "./components/TableRow";
import { LoadingTableState } from "./components/LoadingTableState";
import { EmptyTableState } from "./components/EmptyTableState";

interface LancamentosTableProps {
  lancamentos: LancamentoFinanceiro[] | undefined;
  isLoading: boolean;
  tipo: "receita" | "despesa";
  refetch?: () => void;
}

export function LancamentosTable({
  lancamentos,
  isLoading,
  tipo,
  refetch,
}: LancamentosTableProps) {
  const [selectedLancamento, setSelectedLancamento] = useState<LancamentoFinanceiro | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader tipo={tipo} />
          <TableBody>
            {lancamentos.map((lancamento) => (
              <TableRow 
                key={lancamento.id}
                lancamento={lancamento} 
                tipo={tipo} 
                onViewDetails={handleViewDetails} 
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <LancamentoDetailsDialog
        lancamento={selectedLancamento}
        isOpen={showDetails}
        onClose={handleCloseDetails}
        onAfterStatusChange={refetch}
      />
    </>
  );
}

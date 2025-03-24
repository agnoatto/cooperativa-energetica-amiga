
/**
 * Cards de lançamentos financeiros para visualização mobile
 *
 * Este componente exibe os lançamentos financeiros em formato de cartões,
 * otimizado para dispositivos móveis. Inclui informações como mês de referência,
 * valor, status e ações.
 */
import { LancamentoFinanceiro } from "@/types/financeiro";
import { useState } from "react";
import { LancamentoDetailsDialog } from "../modals/LancamentoDetailsDialog";
import { LancamentoCard } from "./components/LancamentoCard";
import { LancamentosLoadingState } from "./components/LancamentosLoadingState";
import { LancamentosEmptyState } from "./components/LancamentosEmptyState";

interface LancamentosCardsProps {
  lancamentos: LancamentoFinanceiro[] | undefined;
  isLoading: boolean;
  tipo: "receita" | "despesa";
  refetch?: () => void;
}

export function LancamentosCards({
  lancamentos,
  isLoading,
  tipo,
  refetch,
}: LancamentosCardsProps) {
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
    return <LancamentosLoadingState />;
  }

  if (!lancamentos || lancamentos.length === 0) {
    return <LancamentosEmptyState />;
  }

  return (
    <>
      <div className="space-y-3">
        {lancamentos.map((lancamento) => (
          <LancamentoCard
            key={lancamento.id}
            lancamento={lancamento}
            tipo={tipo}
            onViewDetails={handleViewDetails}
          />
        ))}
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

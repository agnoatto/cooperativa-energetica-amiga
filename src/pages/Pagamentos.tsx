
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MonthSelector } from "@/components/pagamentos/MonthSelector";
import { PagamentosHeader } from "@/components/pagamentos/PagamentosHeader";
import { PagamentosTable } from "@/components/pagamentos/PagamentosTable";
import { PagamentoEditModal } from "@/components/pagamentos/PagamentoEditModal";
import { PagamentoDetailsDialog } from "@/components/pagamentos/PagamentoDetailsDialog";
import { PagamentoData } from "@/components/pagamentos/types/pagamento";
import { usePagamentos } from "@/hooks/usePagamentos";
import { useMonthSelection } from "@/hooks/useMonthSelection";

const Pagamentos = () => {
  const [selectedPagamento, setSelectedPagamento] = useState<PagamentoData | null>(null);
  const [selectedPagamentoToEdit, setSelectedPagamentoToEdit] = useState<PagamentoData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const queryClient = useQueryClient();
  const { currentDate, handlePreviousMonth, handleNextMonth } = useMonthSelection();
  const { pagamentos, isLoading, gerarPagamentos, isGenerating } = usePagamentos(currentDate);

  const handleViewDetails = (pagamento: PagamentoData) => {
    setSelectedPagamento(pagamento);
    setShowDetails(true);
  };

  const handleEditPagamento = (pagamento: PagamentoData) => {
    setSelectedPagamentoToEdit(pagamento);
  };

  const handleDeletePagamento = (pagamento: PagamentoData) => {
    // Implementar lógica de exclusão aqui
    console.log("Deletar pagamento:", pagamento);
  };

  return (
    <div className="space-y-6">
      <PagamentosHeader 
        onGerarPagamentos={gerarPagamentos}
        isGenerating={isGenerating}
      />

      <MonthSelector
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      <PagamentosTable
        pagamentos={pagamentos}
        isLoading={isLoading}
        onEditPagamento={handleEditPagamento}
        onViewDetails={handleViewDetails}
        onDeletePagamento={handleDeletePagamento}
      />

      {selectedPagamento && (
        <PagamentoDetailsDialog
          pagamento={selectedPagamento}
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedPagamento(null);
          }}
        />
      )}

      <PagamentoEditModal
        pagamento={selectedPagamentoToEdit}
        isOpen={!!selectedPagamentoToEdit}
        onClose={() => setSelectedPagamentoToEdit(null)}
        onSave={() => {
          queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
        }}
      />
    </div>
  );
}

export default Pagamentos;


import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MonthSelector } from "@/components/pagamentos/MonthSelector";
import { PagamentosHeader } from "@/components/pagamentos/PagamentosHeader";
import { PagamentosTable } from "@/components/pagamentos/PagamentosTable";
import { PagamentoEditModal } from "@/components/pagamentos/PagamentoEditModal";
import { PagamentoData } from "@/components/pagamentos/types/pagamento";
import { usePagamentos } from "@/hooks/usePagamentos";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Pagamentos = () => {
  const [selectedPagamento, setSelectedPagamento] = useState<PagamentoData | null>(null);
  const queryClient = useQueryClient();
  const { currentDate, handlePreviousMonth, handleNextMonth } = useMonthSelection();
  const { pagamentos, isLoading, gerarPagamentos, isGenerating } = usePagamentos(currentDate);

  const handleEditPagamento = (pagamento: PagamentoData) => {
    setSelectedPagamento(pagamento);
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
      />

      <PagamentoEditModal
        pagamento={selectedPagamento}
        isOpen={!!selectedPagamento}
        onClose={() => setSelectedPagamento(null)}
        onSave={() => {
          queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
        }}
      />
    </div>
  );
}

export default Pagamentos;

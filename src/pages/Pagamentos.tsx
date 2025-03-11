
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MonthSelector } from "@/components/pagamentos/MonthSelector";
import { PagamentosHeader } from "@/components/pagamentos/PagamentosHeader";
import { PagamentosDashboard } from "@/components/pagamentos/PagamentosDashboard";
import { PagamentosTable } from "@/components/pagamentos/PagamentosTable";
import { PagamentoDetailsDialog } from "@/components/pagamentos/PagamentoDetailsDialog";
import { DeletePagamentoDialog } from "@/components/pagamentos/DeletePagamentoDialog";
import { PagamentoData } from "@/components/pagamentos/types/pagamento";
import { usePagamentos } from "@/hooks/usePagamentos";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { supabase } from "@/integrations/supabase/client";

const Pagamentos = () => {
  // Estados
  const [selectedPagamento, setSelectedPagamento] = useState<PagamentoData | null>(null);
  const [pagamentoToDelete, setPagamentoToDelete] = useState<PagamentoData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Hooks
  const queryClient = useQueryClient();
  const { currentDate, handlePreviousMonth, handleNextMonth } = useMonthSelection();
  const { pagamentos, isLoading, gerarPagamentos, isGenerating } = usePagamentos(currentDate);

  // Mutation para exclusão
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('deletar_pagamento', { pagamento_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      toast.success("Pagamento excluído com sucesso");
      setPagamentoToDelete(null);
    },
    onError: (error) => {
      console.error("[Pagamentos] Erro ao excluir pagamento:", error);
      toast.error("Erro ao excluir pagamento");
    },
  });

  // Handlers
  const handleViewDetails = (pagamento: PagamentoData) => {
    setSelectedPagamento(pagamento);
    setShowDetails(true);
  };

  const handleDeletePagamento = (pagamento: PagamentoData) => {
    setPagamentoToDelete(pagamento);
  };

  const handleConfirmDelete = async () => {
    if (!pagamentoToDelete?.id) {
      console.error("[Pagamentos] Tentativa de excluir pagamento sem ID");
      toast.error("Erro ao excluir pagamento: ID não encontrado");
      return;
    }

    try {
      await deleteMutation.mutateAsync(pagamentoToDelete.id);
    } catch (error) {
      console.error("[Pagamentos] Erro ao executar mutation de exclusão:", error);
    }
  };

  return (
    <div className="space-y-6">
      <PagamentosHeader 
        onGerarPagamentos={gerarPagamentos}
        isGenerating={isGenerating}
      />

      <PagamentosDashboard 
        pagamentos={pagamentos || []}
        isLoading={isLoading}
      />

      <MonthSelector
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      <PagamentosTable
        pagamentos={pagamentos}
        isLoading={isLoading}
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

      <DeletePagamentoDialog
        pagamento={pagamentoToDelete}
        isDeleting={deleteMutation.isPending}
        onClose={() => setPagamentoToDelete(null)}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default Pagamentos;

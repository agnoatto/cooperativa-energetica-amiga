
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MonthSelector } from "@/components/pagamentos/MonthSelector";
import { PagamentosHeader } from "@/components/pagamentos/PagamentosHeader";
import { PagamentosDashboard } from "@/components/pagamentos/PagamentosDashboard";
import { PagamentosTable } from "@/components/pagamentos/PagamentosTable";
import { PagamentoEditModal } from "@/components/pagamentos/PagamentoEditModal";
import { PagamentoDetailsDialog } from "@/components/pagamentos/PagamentoDetailsDialog";
import { DeletePagamentoDialog } from "@/components/pagamentos/DeletePagamentoDialog";
import { PagamentoData } from "@/components/pagamentos/types/pagamento";
import { usePagamentos } from "@/hooks/usePagamentos";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { supabase } from "@/integrations/supabase/client";

const Pagamentos = () => {
  const [selectedPagamento, setSelectedPagamento] = useState<PagamentoData | null>(null);
  const [selectedPagamentoToEdit, setSelectedPagamentoToEdit] = useState<PagamentoData | null>(null);
  const [pagamentoToDelete, setPagamentoToDelete] = useState<PagamentoData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const queryClient = useQueryClient();
  const { currentDate, handlePreviousMonth, handleNextMonth } = useMonthSelection();
  const { pagamentos, isLoading, gerarPagamentos, isGenerating } = usePagamentos(currentDate);

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
    onError: () => {
      toast.error("Erro ao excluir pagamento");
    },
  });

  const handleViewDetails = (pagamento: PagamentoData) => {
    setSelectedPagamento(pagamento);
    setShowDetails(true);
  };

  const handleEditPagamento = (pagamento: PagamentoData) => {
    setSelectedPagamentoToEdit(pagamento);
  };

  const handleDeletePagamento = (pagamento: PagamentoData) => {
    setPagamentoToDelete(pagamento);
  };

  const handleConfirmDelete = async () => {
    if (!pagamentoToDelete) return;
    await deleteMutation.mutateAsync(pagamentoToDelete.id);
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

      <DeletePagamentoDialog
        pagamento={pagamentoToDelete}
        isOpen={!!pagamentoToDelete}
        isDeleting={deleteMutation.isPending}
        onClose={() => setPagamentoToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Pagamentos;

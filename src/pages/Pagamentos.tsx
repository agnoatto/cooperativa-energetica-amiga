
/**
 * Página principal de gerenciamento de pagamentos de usinas fotovoltaicas
 * 
 * Esta página permite visualizar, editar e gerenciar todos os pagamentos
 * relacionados às usinas, incluindo geração de energia, valores e datas.
 */
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MonthSelector } from "@/components/MonthSelector";
import { PagamentosHeader } from "@/components/pagamentos/PagamentosHeader";
import { PagamentosDashboard } from "@/components/pagamentos/PagamentosDashboard";
import { PagamentosTable } from "@/components/pagamentos/PagamentosTable";
import { PagamentoDetailsDialog } from "@/components/pagamentos/PagamentoDetailsDialog";
import { DeletePagamentoDialog } from "@/components/pagamentos/DeletePagamentoDialog";
import { PagamentoEditModal } from "@/components/pagamentos/PagamentoEditModal";
import { PagamentoData } from "@/components/pagamentos/types/pagamento";
import { usePagamentos } from "@/hooks/usePagamentos";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { supabase } from "@/integrations/supabase/client";

const Pagamentos = () => {
  // Estados
  const [selectedPagamento, setSelectedPagamento] = useState<PagamentoData | null>(null);
  const [selectedPagamentoToEdit, setSelectedPagamentoToEdit] = useState<PagamentoData | null>(null);
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

  const handleEditPagamento = (pagamento: PagamentoData) => {
    setSelectedPagamentoToEdit(pagamento);
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
        className="bg-white rounded-lg shadow-sm border"
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
        isDeleting={deleteMutation.isPending}
        onClose={() => setPagamentoToDelete(null)}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default Pagamentos;

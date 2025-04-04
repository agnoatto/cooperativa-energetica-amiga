
/**
 * Página de Pagamentos
 * 
 * Exibe e gerencia todos os pagamentos aos cooperados relacionados à 
 * energia gerada pelas usinas fotovoltaicas.
 * Inclui funcionalidades para geração, visualização e gerenciamento de pagamentos.
 */
import { useState, useCallback, useEffect } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { toast } from "sonner";
import { PagamentosExcelTable } from "@/components/pagamentos/table/PagamentosExcelTable";
import { PagamentosHeader } from "@/components/pagamentos/PagamentosHeader";
import { PagamentosDashboard } from "@/components/pagamentos/PagamentosDashboard";
import { FilterBar } from "@/components/shared/FilterBar";
import { usePagamentos } from "@/hooks/usePagamentos";
import { PagamentoData } from "@/components/pagamentos/types/pagamento";
import { PagamentoDetailsDialog } from "@/components/pagamentos/PagamentoDetailsDialog";
import { PagamentoEditModal } from "@/components/pagamentos/PagamentoEditModal";
import { DeletePagamentoDialog } from "@/components/pagamentos/DeletePagamentoDialog";

export default function Pagamentos() {
  const [busca, setBusca] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPagamento, setSelectedPagamento] = useState<PagamentoData | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pagamentoToDelete, setPagamentoToDelete] = useState<PagamentoData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Formatar a data para o formato YYYY-MM para uso nas queries
  const periodoAtual = format(currentDate, "yyyy-MM");

  const { pagamentos, isLoading, refetch, gerarPagamentos, isGenerating } = usePagamentos({
    periodo: periodoAtual,
    busca,
  });

  // Handlers para navegação entre meses
  const handlePreviousMonth = useCallback(() => {
    console.log("Mês anterior selecionado");
    setCurrentDate(prev => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    console.log("Próximo mês selecionado");
    setCurrentDate(prev => addMonths(prev, 1));
  }, []);

  const handleLimparFiltros = () => {
    setBusca("");
    // Não resetar o mês ao limpar filtros, apenas o campo de busca
  };

  const handleViewDetails = (pagamento: PagamentoData) => {
    setSelectedPagamento(pagamento);
    setShowDetailsDialog(true);
  };

  const handleEditPagamento = (pagamento: PagamentoData) => {
    setSelectedPagamento(pagamento);
    setShowEditModal(true);
  };

  const handleDeletePagamento = (pagamento: PagamentoData) => {
    setPagamentoToDelete(pagamento);
  };

  const handleConfirmDelete = async () => {
    if (!pagamentoToDelete) return;
    
    setIsDeleting(true);
    try {
      // Implementar a lógica de exclusão
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
      
      toast.success("Pagamento excluído com sucesso");
      setPagamentoToDelete(null);
      refetch();
    } catch (error) {
      console.error("Erro ao excluir pagamento:", error);
      toast.error("Erro ao excluir pagamento");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    refetch();
    toast.success("Pagamento atualizado com sucesso");
  };

  return (
    <div className="space-y-6">
      <PagamentosHeader 
        onGerarPagamentos={gerarPagamentos} 
        isGenerating={isGenerating}
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />
      
      <PagamentosDashboard 
        pagamentos={pagamentos || []} 
        isLoading={isLoading} 
      />
      
      <div className="mb-4">
        <FilterBar
          busca={busca}
          onBuscaChange={setBusca}
          onLimparFiltros={handleLimparFiltros}
          placeholder="Buscar por cooperado, usina ou valor..."
        />
      </div>
      
      <PagamentosExcelTable 
        pagamentos={pagamentos || []} 
        isLoading={isLoading} 
        onEditPagamento={handleEditPagamento}
        onViewDetails={handleViewDetails}
        onDeletePagamento={handleDeletePagamento}
      />

      {/* Modal de Detalhes */}
      {selectedPagamento && (
        <PagamentoDetailsDialog 
          isOpen={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
          pagamento={selectedPagamento}
        />
      )}

      {/* Modal de Edição */}
      {selectedPagamento && (
        <PagamentoEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          pagamento={selectedPagamento}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Confirmação de Exclusão */}
      <DeletePagamentoDialog
        pagamento={pagamentoToDelete}
        isDeleting={isDeleting}
        onDelete={handleConfirmDelete}
        onClose={() => setPagamentoToDelete(null)}
      />
    </div>
  );
}

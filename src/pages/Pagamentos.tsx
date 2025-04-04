
/**
 * Página de Pagamentos
 * 
 * Exibe e gerencia todos os pagamentos aos cooperados relacionados à 
 * energia gerada pelas usinas fotovoltaicas.
 * Inclui funcionalidades para geração, visualização e gerenciamento de pagamentos.
 */
import { useState, useCallback } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { toast } from "sonner";
import { PagamentosExcelTable } from "@/components/pagamentos/table/PagamentosExcelTable";
import { PagamentosHeader } from "@/components/pagamentos/PagamentosHeader";
import { PagamentosDashboard } from "@/components/pagamentos/PagamentosDashboard";
import { FilterBar } from "@/components/shared/FilterBar";
import { usePagamentos } from "@/hooks/usePagamentos";
import { PagamentoData } from "@/components/pagamentos/types/pagamento";

export default function Pagamentos() {
  const [busca, setBusca] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  
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
        onEditPagamento={(pagamento: PagamentoData) => console.log('Edit', pagamento)}
        onViewDetails={(pagamento: PagamentoData) => console.log('View', pagamento)}
        onDeletePagamento={(pagamento: PagamentoData) => console.log('Delete', pagamento)}
      />
    </div>
  );
}

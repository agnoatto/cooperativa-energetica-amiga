
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
import { PagamentosTable } from "@/components/pagamentos/PagamentosTable";
import { PagamentosHeader } from "@/components/pagamentos/PagamentosHeader";
import { PagamentosDashboard } from "@/components/pagamentos/PagamentosDashboard";
import { FilterBarWithMonth } from "@/components/shared/FilterBarWithMonth";
import { usePagamentos } from "@/hooks/usePagamentos";

export default function Pagamentos() {
  const [busca, setBusca] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isGenerating, setIsGenerating] = useState(false);

  // Formatar a data para o formato YYYY-MM para uso nas queries
  const periodoAtual = format(currentDate, "yyyy-MM");

  const { data: pagamentos, isLoading, refetch } = usePagamentos({
    periodo: periodoAtual,
    busca,
  });

  // Handler para gerar pagamentos do mês atual
  const handleGerarPagamentos = async () => {
    try {
      setIsGenerating(true);
      
      // Simular uma operação assíncrona (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Pagamentos gerados com sucesso para ${format(currentDate, "MMMM/yyyy")}`);
      
      // Após a geração bem-sucedida, recarregar os dados
      refetch();
    } catch (error) {
      toast.error("Erro ao gerar pagamentos. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handlers para navegação entre meses
  const handlePreviousMonth = useCallback(() => {
    setCurrentDate(prev => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, 1));
  }, []);

  const handleLimparFiltros = () => {
    setBusca("");
    // Não resetar o mês ao limpar filtros, apenas o campo de busca
  };

  return (
    <div className="space-y-6">
      <PagamentosHeader 
        onGerarPagamentos={handleGerarPagamentos} 
        isGenerating={isGenerating}
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />
      
      <PagamentosDashboard pagamentos={pagamentos || []} />
      
      <FilterBarWithMonth
        busca={busca}
        onBuscaChange={setBusca}
        onLimparFiltros={handleLimparFiltros}
        placeholder="Buscar por cooperado, usina ou valor..."
        onMonthChange={setCurrentDate}
      />
      
      <PagamentosTable 
        pagamentos={pagamentos || []} 
        isLoading={isLoading} 
        refetch={refetch}
      />
    </div>
  );
}

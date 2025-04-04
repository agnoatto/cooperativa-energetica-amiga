
/**
 * Página principal de Faturas
 * 
 * Esta página exibe o módulo de gerenciamento de faturas de energia,
 * permitindo a visualização, geração e gestão de faturas dos clientes.
 * Inclui um dashboard simplificado com métricas importantes.
 */
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { FaturasContainer } from "@/components/faturas/FaturasContainer";
import { FaturasDashboard } from "@/components/faturas/FaturasDashboard";
import { useFetchFaturas } from "@/hooks/faturas/useFetchFaturas";

export default function Faturas() {
  // Usa o hook para obter o mês atual selecionado e os manipuladores
  const { 
    selectedDate: currentDate, 
    handlePreviousMonth, 
    handleNextMonth 
  } = useMonthSelection();
  
  // Buscar faturas para o dashboard
  const { data: faturas, isLoading } = useFetchFaturas(currentDate);
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Dashboard de Faturas */}
      <FaturasDashboard 
        faturas={faturas} 
        isLoading={isLoading} 
        currentDate={currentDate}
      />
      
      <FaturasContainer 
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />
    </div>
  );
}

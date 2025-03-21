
/**
 * Página principal de Faturas
 * 
 * Esta página exibe o módulo de gerenciamento de faturas de energia,
 * permitindo a visualização, geração e gestão de faturas dos clientes.
 */
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { FaturasContainer } from "@/components/faturas/FaturasContainer";

export default function Faturas() {
  // Usa o hook para obter o mês atual selecionado
  const { currentDate } = useMonthSelection();
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">Faturas</h1>
        <p className="text-muted-foreground">
          Gerenciamento de faturas de energia
        </p>
      </div>
      
      <FaturasContainer />
    </div>
  );
}

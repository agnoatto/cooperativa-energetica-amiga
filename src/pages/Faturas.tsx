
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { FaturasContainer } from "@/components/faturas/FaturasContainer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Faturas() {
  // Usa o hook para obter o mês atual selecionado
  const { currentDate } = useMonthSelection();
  
  // Formata o mês/ano para exibição
  const mesAnoFormatado = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">Faturas</h1>
        <p className="text-muted-foreground">
          Gerenciamento de faturas de energia - {mesAnoFormatado}
        </p>
      </div>
      
      <FaturasContainer />
    </div>
  );
}

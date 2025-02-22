
import { useState } from "react";
import { useLancamentosFinanceiros } from "@/hooks/lancamentos/useLancamentosFinanceiros";
import { FiltrosLancamento } from "@/components/financeiro/FiltrosLancamento";
import { StatusLancamento } from "@/types/financeiro";
import { useIsMobile } from "@/hooks/use-mobile";
import { LancamentosTable } from "@/components/financeiro/table/LancamentosTable";
import { LancamentosCards } from "@/components/financeiro/cards/LancamentosCards";
import { MonthSelector } from "@/components/financeiro/MonthSelector";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { startOfMonth, endOfMonth, format } from "date-fns";

export default function ContasPagar() {
  const [status, setStatus] = useState<StatusLancamento | 'todos'>('todos');
  const [dataInicio, setDataInicio] = useState(() => {
    const hoje = new Date();
    return format(startOfMonth(hoje), 'yyyy-MM-dd');
  });
  const [dataFim, setDataFim] = useState(() => {
    const hoje = new Date();
    return format(endOfMonth(hoje), 'yyyy-MM-dd');
  });
  const [busca, setBusca] = useState('');
  const isMobile = useIsMobile();
  const { currentDate, handlePreviousMonth, handleNextMonth } = useMonthSelection();

  const { data: lancamentos, isLoading } = useLancamentosFinanceiros({
    tipo: 'despesa',
    status,
    dataInicio,
    dataFim,
    busca,
  });

  const handleMonthChange = (date: Date) => {
    setDataInicio(format(startOfMonth(date), 'yyyy-MM-dd'));
    setDataFim(format(endOfMonth(date), 'yyyy-MM-dd'));
  };

  const handleLimparFiltros = () => {
    setStatus('todos');
    // Ao limpar filtros, voltamos para o mês atual
    const hoje = new Date();
    setDataInicio(format(startOfMonth(hoje), 'yyyy-MM-dd'));
    setDataFim(format(endOfMonth(hoje), 'yyyy-MM-dd'));
    setBusca('');
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>
        Contas a Pagar
      </h1>

      <MonthSelector
        currentDate={currentDate}
        onPreviousMonth={() => {
          handlePreviousMonth();
          handleMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
        }}
        onNextMonth={() => {
          handleNextMonth();
          handleMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
        }}
      />

      <FiltrosLancamento
        status={status}
        dataInicio={dataInicio}
        dataFim={dataFim}
        busca={busca}
        onStatusChange={setStatus}
        onDataInicioChange={setDataInicio}
        onDataFimChange={setDataFim}
        onBuscaChange={setBusca}
        onLimparFiltros={handleLimparFiltros}
      />

      {isMobile ? (
        <LancamentosCards
          lancamentos={lancamentos}
          isLoading={isLoading}
          tipo="despesa"
        />
      ) : (
        <LancamentosTable
          lancamentos={lancamentos}
          isLoading={isLoading}
          tipo="despesa"
        />
      )}
    </div>
  );
}

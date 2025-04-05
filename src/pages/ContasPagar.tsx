
/**
 * Página de Contas a Pagar
 * 
 * Exibe todos os lançamentos financeiros do tipo despesa
 * com filtros avançados de ERP para facilitar a gestão financeira
 * e seletor de mês para filtragem por período.
 */
import { useLancamentosFinanceiros } from "@/hooks/lancamentos/useLancamentosFinanceiros";
import { StatusLancamento } from "@/types/financeiro";
import { useIsMobile } from "@/hooks/use-mobile";
import { LancamentosCards } from "@/components/financeiro/cards/LancamentosCards";
import { LancamentosDashboard } from "@/components/financeiro/dashboard/LancamentosDashboard";
import { useState } from "react";
import { FiltrosLancamento } from "@/components/financeiro/FiltrosLancamento";
import { MonthSelector } from "@/components/MonthSelector";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { LancamentosExcelTable } from "@/components/financeiro/table/LancamentosExcelTable";

export default function ContasPagar() {
  const [status, setStatus] = useState<StatusLancamento | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const isMobile = useIsMobile();

  // Usar o hook de seleção de mês para gerenciar a navegação entre meses
  const { 
    selectedDate, 
    handlePreviousMonth, 
    handleNextMonth 
  } = useMonthSelection();

  const { data: lancamentos, isLoading, refetch } = useLancamentosFinanceiros({
    tipo: 'despesa',
    status,
    busca,
    dataInicio,
    dataFim
  });

  const handleLimparFiltros = () => {
    setStatus('todos');
    setBusca('');
    setDataInicio('');
    setDataFim('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>
          Contas a Pagar
        </h1>
        
        {/* Seletor de mês */}
        <MonthSelector 
          currentDate={selectedDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          className="self-center sm:self-auto"
        />
      </div>

      <LancamentosDashboard lancamentos={lancamentos} />

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
          refetch={refetch}
        />
      ) : (
        <LancamentosExcelTable
          lancamentos={lancamentos}
          isLoading={isLoading}
          tipo="despesa"
          refetch={refetch}
        />
      )}
    </div>
  );
}


import { useLancamentosFinanceiros } from "@/hooks/lancamentos/useLancamentosFinanceiros";
import { StatusLancamento } from "@/types/financeiro";
import { useIsMobile } from "@/hooks/use-mobile";
import { LancamentosTable } from "@/components/financeiro/table/LancamentosTable";
import { LancamentosCards } from "@/components/financeiro/cards/LancamentosCards";
import { LancamentosDashboard } from "@/components/financeiro/dashboard/LancamentosDashboard";
import { useState } from "react";
import { FiltrosLancamento } from "@/components/financeiro/FiltrosLancamento";

/**
 * Página de Contas a Pagar
 * 
 * Exibe todos os lançamentos financeiros do tipo despesa
 * com filtros avançados de ERP para facilitar a gestão financeira
 */
export default function ContasPagar() {
  const [status, setStatus] = useState<StatusLancamento | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const isMobile = useIsMobile();

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
      <h1 className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>
        Contas a Pagar
      </h1>

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
        <LancamentosTable
          lancamentos={lancamentos}
          isLoading={isLoading}
          tipo="despesa"
          refetch={refetch}
        />
      )}
    </div>
  );
}

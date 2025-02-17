
import { useState } from "react";
import { useLancamentosFinanceiros } from "@/hooks/lancamentos/useLancamentosFinanceiros";
import { FiltrosLancamento } from "@/components/financeiro/FiltrosLancamento";
import { StatusLancamento } from "@/types/financeiro";
import { useIsMobile } from "@/hooks/use-mobile";
import { LancamentosTable } from "@/components/financeiro/table/LancamentosTable";
import { LancamentosCards } from "@/components/financeiro/cards/LancamentosCards";

export default function ContasReceber() {
  const [status, setStatus] = useState<StatusLancamento | 'todos'>('todos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [busca, setBusca] = useState('');
  const isMobile = useIsMobile();

  const { data: lancamentos, isLoading } = useLancamentosFinanceiros({
    tipo: 'receita',
    status,
    dataInicio,
    dataFim,
    busca,
  });

  const handleLimparFiltros = () => {
    setStatus('todos');
    setDataInicio('');
    setDataFim('');
    setBusca('');
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>
        Contas a Receber
      </h1>

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
          tipo="receita"
        />
      ) : (
        <LancamentosTable
          lancamentos={lancamentos}
          isLoading={isLoading}
          tipo="receita"
        />
      )}
    </div>
  );
}

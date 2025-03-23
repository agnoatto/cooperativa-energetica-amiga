
/**
 * Página de Contas a Receber
 * 
 * Esta página exibe todos os lançamentos financeiros do tipo receita
 * com filtragem avançada e dashboard para visualização de métricas.
 * Os lançamentos são gerados automaticamente a partir das faturas,
 * usando o valor_assinatura como base e apenas mostra faturas que já
 * foram enviadas para os clientes (status enviada, reenviada, atrasada, paga).
 */

import { useLancamentosFinanceiros } from "@/hooks/lancamentos/useLancamentosFinanceiros";
import { StatusLancamento } from "@/types/financeiro";
import { useIsMobile } from "@/hooks/use-mobile";
import { LancamentosTable } from "@/components/financeiro/table/LancamentosTable";
import { LancamentosCards } from "@/components/financeiro/cards/LancamentosCards";
import { LancamentosDashboard } from "@/components/financeiro/dashboard/LancamentosDashboard";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FiltrosLancamento } from "@/components/financeiro/FiltrosLancamento";
import { AlertCircle, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ContasReceber() {
  const [status, setStatus] = useState<StatusLancamento | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tentativas, setTentativas] = useState(0);
  const isMobile = useIsMobile();

  const { data: lancamentos, isLoading, error, refetch } = useLancamentosFinanceiros({
    tipo: 'receita',
    status,
    busca,
    dataInicio,
    dataFim
  });

  useEffect(() => {
    // Exibir notificação informando que só estamos exibindo lançamentos de faturas enviadas
    toast.info(
      "Contas a Receber", 
      { 
        description: "Esta página exibe apenas lançamentos de faturas que já foram enviadas aos clientes."
      }
    );
  }, []);

  // Exibir notificação quando houver lançamentos com valor zero
  useEffect(() => {
    if (lancamentos && lancamentos.length > 0) {
      const lancamentosZerados = lancamentos.filter(l => l.valor === 0);
      if (lancamentosZerados.length > 0) {
        toast.info(
          "Existem lançamentos com valor zero", 
          { 
            description: "Verifique se as faturas correspondentes possuem valor de assinatura preenchido."
          }
        );
      }
    }
  }, [lancamentos]);

  const handleLimparFiltros = () => {
    setStatus('todos');
    setBusca('');
    setDataInicio('');
    setDataFim('');
  };

  const handleRetry = () => {
    setTentativas(prev => prev + 1);
    toast.info("Tentando recarregar os dados...");
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>
          Contas a Receber
        </h1>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRetry}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4" />
        <AlertTitle>Informação</AlertTitle>
        <AlertDescription>
          Esta página mostra apenas os lançamentos relacionados a faturas que já foram enviadas aos clientes 
          (status: enviada, reenviada, atrasada, paga, finalizada).
        </AlertDescription>
      </Alert>

      <LancamentosDashboard lancamentos={lancamentos} />

      {lancamentos && lancamentos.length > 0 && lancamentos.every(l => l.valor === 0) && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Valores zerados detectados</AlertTitle>
          <AlertDescription>
            Todos os lançamentos têm valor zero. Verifique se as faturas correspondentes têm valor de assinatura preenchido.
            Se você acabou de corrigir o problema com as funções do banco de dados, pode demorar um pouco para que os valores
            sejam atualizados. Você pode gerar novas faturas para testar a correção.
          </AlertDescription>
        </Alert>
      )}

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
          refetch={refetch}
        />
      ) : (
        <LancamentosTable
          lancamentos={lancamentos}
          isLoading={isLoading}
          tipo="receita"
          refetch={refetch}
        />
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-600">
          <p className="font-semibold">Erro ao carregar dados:</p>
          <p className="text-sm mt-1">{error instanceof Error ? error.message : "Erro desconhecido"}</p>
          <Button 
            onClick={handleRetry} 
            className="mt-4 bg-red-100 hover:bg-red-200 text-red-700"
            variant="ghost"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      )}
    </div>
  );
}

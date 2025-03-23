
/**
 * Página de Contas a Receber
 * 
 * Esta página exibe todos os lançamentos financeiros do tipo receita
 * com filtragem avançada e dashboard para visualização de métricas.
 * Os lançamentos são gerados automaticamente a partir das faturas,
 * usando o valor_assinatura como base e apenas mostra faturas que já
 * foram enviadas para os clientes (status enviada, reenviada, atrasada, paga).
 * Inclui também uma funcionalidade para sincronizar lançamentos financeiros com faturas.
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
import { AlertCircle, RefreshCw, Info, RotateCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSincronizarLancamentos } from "@/hooks/lancamentos/useSincronizarLancamentos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const { sincronizar, isSincronizando, resultado, erro } = useSincronizarLancamentos();

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

  // Exibir resultado da sincronização quando disponível
  useEffect(() => {
    if (resultado) {
      if (resultado.total_sincronizado > 0) {
        toast.success(
          `${resultado.total_sincronizado} lançamentos sincronizados`, 
          { 
            description: "Os lançamentos financeiros foram sincronizados com as faturas."
          }
        );
        
        // Recarregar dados após sincronização bem-sucedida
        refetch();
      } else {
        toast.info(
          "Não há faturas para sincronizar", 
          { 
            description: "Todas as faturas enviadas já possuem lançamentos correspondentes."
          }
        );
      }
    }
  }, [resultado, refetch]);

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

  const handleSincronizar = async () => {
    toast.info("Iniciando sincronização de lançamentos...");
    const result = await sincronizar();
    
    if (result && result.total_sincronizado > 0) {
      toast.success(`${result.total_sincronizado} lançamentos criados com sucesso!`);
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>
          Contas a Receber
        </h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSincronizar}
            disabled={isSincronizando}
          >
            <RotateCw className={`h-4 w-4 mr-2 ${isSincronizando ? 'animate-spin' : ''}`} />
            Sincronizar Lançamentos
          </Button>
          
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

      {erro && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao sincronizar lançamentos</AlertTitle>
          <AlertDescription>
            Ocorreu um erro durante a sincronização: {erro.message}
          </AlertDescription>
        </Alert>
      )}

      {resultado && resultado.detalhes && resultado.detalhes.length > 0 && (
        <Tabs defaultValue="lancamentos">
          <TabsList>
            <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
            <TabsTrigger value="detalhes">Detalhes de Sincronização</TabsTrigger>
          </TabsList>
          <TabsContent value="lancamentos">
            {/* Conteúdo normal da página */}
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
          </TabsContent>
          <TabsContent value="detalhes">
            <div className="p-4 border rounded-md bg-slate-50">
              <h3 className="font-medium mb-2">Detalhes da sincronização ({resultado.total_sincronizado} lançamentos)</h3>
              <div className="space-y-1 max-h-[400px] overflow-y-auto text-sm font-mono p-2 bg-slate-100 rounded">
                {resultado.detalhes.map((detalhe, index) => (
                  <p key={index} className={detalhe.includes('Erro') ? 'text-red-600' : ''}>
                    {detalhe}
                  </p>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
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

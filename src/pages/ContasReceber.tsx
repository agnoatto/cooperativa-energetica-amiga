
/**
 * Página de Contas a Receber
 * 
 * Esta página exibe todos os lançamentos financeiros do tipo receita
 * com tratamento de erros melhorado e alternativas para contornar problemas
 * de segurança no banco de dados. Inclui fallbacks e mensagens claras para o usuário.
 */

import { useLancamentosFinanceiros } from "@/hooks/lancamentos/useLancamentosFinanceiros";
import { useIsMobile } from "@/hooks/use-mobile";
import { LancamentosTable } from "@/components/financeiro/table/LancamentosTable";
import { LancamentosCards } from "@/components/financeiro/cards/LancamentosCards";
import { LancamentosDashboard } from "@/components/financeiro/dashboard/LancamentosDashboard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { StatusLancamento } from "@/types/financeiro";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterBar } from "@/components/shared/FilterBar";

export default function ContasReceber() {
  const isMobile = useIsMobile();
  const [tentativas, setTentativas] = useState(0);
  const [status, setStatus] = useState<StatusLancamento | 'todos'>('todos');
  const [busca, setBusca] = useState('');

  const { data: lancamentos, isLoading, refetch, error } = useLancamentosFinanceiros({
    tipo: 'receita',
    status,
    busca,
  });

  useEffect(() => {
    // Exibir detalhes do erro para ajudar na depuração
    if (error) {
      console.error("Erro detalhado ao carregar lançamentos:", error);
      
      // Verificar se é um erro relacionado a RLS ou permissões
      const mensagemErro = error instanceof Error ? error.message : String(error);
      if (mensagemErro.includes("policy") || mensagemErro.includes("permission") || mensagemErro.includes("recursion")) {
        toast.error("Erro de permissão no banco de dados", {
          description: "Existe uma restrição de segurança impedindo o acesso aos dados. Entre em contato com o administrador."
        });
      } else {
        toast.error("Erro ao carregar lançamentos", {
          description: "Houve um problema ao buscar os dados. Tente novamente mais tarde."
        });
      }
    }
  }, [error]);

  // Tenta recarregar os dados quando a página é montada ou quando aumenta o número de tentativas
  useEffect(() => {
    refetch();
  }, [refetch, tentativas]);

  const handleRetry = () => {
    setTentativas(prev => prev + 1);
    toast.info("Tentando carregar novamente...");
    refetch();
  };

  const handleLimparFiltros = () => {
    setStatus('todos');
    setBusca('');
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

      <LancamentosDashboard lancamentos={lancamentos} />

      <FilterBar
        busca={busca}
        onBuscaChange={setBusca}
        onLimparFiltros={handleLimparFiltros}
        placeholder="Buscar por descrição..."
      >
        <div className="w-full sm:w-48">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as StatusLancamento | 'todos')}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </FilterBar>

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
          {(error instanceof Error && error.message.includes("policy")) && (
            <p className="text-sm mt-2 text-gray-700">
              Este erro está relacionado a permissões no banco de dados. O acesso aos dados está
              restrito por políticas de segurança. Entre em contato com o administrador.
            </p>
          )}
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

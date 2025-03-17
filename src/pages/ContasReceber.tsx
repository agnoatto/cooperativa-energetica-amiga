
/**
 * Página de Contas a Receber
 * 
 * Esta página exibe todos os lançamentos financeiros do tipo receita
 * sem aplicar filtros, mostrando todas as informações da tabela lancamentos_financeiros
 */

import { useLancamentosFinanceiros } from "@/hooks/lancamentos/useLancamentosFinanceiros";
import { useIsMobile } from "@/hooks/use-mobile";
import { LancamentosTable } from "@/components/financeiro/table/LancamentosTable";
import { LancamentosCards } from "@/components/financeiro/cards/LancamentosCards";
import { LancamentosDashboard } from "@/components/financeiro/dashboard/LancamentosDashboard";
import { useEffect } from "react";

export default function ContasReceber() {
  const isMobile = useIsMobile();

  const { data: lancamentos, isLoading, refetch, error } = useLancamentosFinanceiros({
    tipo: 'receita',
  });

  useEffect(() => {
    // Tenta recarregar os dados quando a página é montada
    refetch();
  }, [refetch]);

  // Log para depuração
  useEffect(() => {
    if (error) {
      console.error("Erro ao carregar lançamentos:", error);
    }
    if (lancamentos) {
      console.log("Lançamentos carregados:", lancamentos.length);
    }
  }, [lancamentos, error]);

  return (
    <div className="space-y-6">
      <h1 className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>
        Contas a Receber
      </h1>

      <LancamentosDashboard lancamentos={lancamentos} />

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

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          <p className="font-semibold">Erro ao carregar dados:</p>
          <p className="text-sm">{error instanceof Error ? error.message : "Erro desconhecido"}</p>
        </div>
      )}
    </div>
  );
}

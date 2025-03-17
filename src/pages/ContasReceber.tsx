
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

export default function ContasReceber() {
  const isMobile = useIsMobile();

  const { data: lancamentos, isLoading } = useLancamentosFinanceiros({
    tipo: 'receita',
  });

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
    </div>
  );
}

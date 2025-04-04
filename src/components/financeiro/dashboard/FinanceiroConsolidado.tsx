
/**
 * Componente de Visão Consolidada Financeira
 * 
 * Exibe um resumo consolidado das principais métricas financeiras,
 * incluindo totais, médias e indicadores de desempenho.
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";

interface FinanceiroConsolidadoProps {
  receitas: LancamentoFinanceiro[];
  despesas: LancamentoFinanceiro[];
}

export function FinanceiroConsolidado({ 
  receitas, 
  despesas 
}: FinanceiroConsolidadoProps) {
  // Calcular métricas financeiras
  const totalReceitas = receitas.reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesas = despesas.reduce((acc, curr) => acc + curr.valor, 0);
  const saldoLiquido = totalReceitas - totalDespesas;
  
  // Receitas pendentes e recebidas
  const receitasPendentes = receitas
    .filter(r => r.status === 'pendente')
    .reduce((acc, curr) => acc + curr.valor, 0);
    
  const receitasRecebidas = receitas
    .filter(r => r.status === 'pago')
    .reduce((acc, curr) => acc + curr.valor, 0);
  
  // Despesas pendentes e pagas
  const despesasPendentes = despesas
    .filter(d => d.status === 'pendente')
    .reduce((acc, curr) => acc + curr.valor, 0);
    
  const despesasPagas = despesas
    .filter(d => d.status === 'pago')
    .reduce((acc, curr) => acc + curr.valor, 0);
  
  // Calcular margem (se tiver receita)
  const margem = totalReceitas > 0 
    ? Math.round((saldoLiquido / totalReceitas) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo Financeiro</CardTitle>
        <CardDescription>Visão consolidada do período</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Receitas</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total</span>
                <span className="font-medium">{formatarMoeda(totalReceitas)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Recebidas</span>
                <span className="text-green-600">{formatarMoeda(receitasRecebidas)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pendentes</span>
                <span className="text-amber-600">{formatarMoeda(receitasPendentes)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Despesas</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total</span>
                <span className="font-medium">{formatarMoeda(totalDespesas)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pagas</span>
                <span className="text-red-600">{formatarMoeda(despesasPagas)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pendentes</span>
                <span className="text-amber-600">{formatarMoeda(despesasPendentes)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between">
            <span className="font-medium">Saldo Líquido</span>
            <span className={`font-bold ${saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatarMoeda(saldoLiquido)}
            </span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Margem</span>
            <span className={`font-medium ${margem >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {margem}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

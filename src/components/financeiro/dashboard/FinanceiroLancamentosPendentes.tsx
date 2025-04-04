
/**
 * Componente de Lançamentos Pendentes
 * 
 * Exibe uma lista dos próximos lançamentos pendentes (receitas e despesas)
 * ordenados por data de vencimento para facilitar o planejamento financeiro.
 */
import { Badge } from "@/components/ui/badge";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { format, parseISO, addDays, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatarMoeda } from "@/utils/formatters";
import { LinkComponent } from "./components/LinkComponent";

interface FinanceiroLancamentosPendentesProps {
  receitas: LancamentoFinanceiro[];
  despesas: LancamentoFinanceiro[];
}

export function FinanceiroLancamentosPendentes({ 
  receitas, 
  despesas 
}: FinanceiroLancamentosPendentesProps) {
  // Combinar lançamentos pendentes
  const hoje = new Date();
  const seteDiasDepois = addDays(hoje, 7);
  
  // Filtrar lançamentos pendentes a vencer nos próximos 7 dias
  const receitasPendentes = receitas
    .filter(r => 
      r.status === 'pendente' && 
      isBefore(parseISO(r.data_vencimento), seteDiasDepois)
    )
    .sort((a, b) => 
      new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime()
    );
    
  const despesasPendentes = despesas
    .filter(d => 
      d.status === 'pendente' && 
      isBefore(parseISO(d.data_vencimento), seteDiasDepois)
    )
    .sort((a, b) => 
      new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime()
    );
  
  // Ordenar todos lançamentos por data
  const todosLancamentos = [...receitasPendentes, ...despesasPendentes]
    .sort((a, b) => 
      new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime()
    )
    .slice(0, 5); // Limitar a 5 itens
  
  if (todosLancamentos.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-500">
        Não há lançamentos pendentes para os próximos 7 dias
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {todosLancamentos.map((lancamento) => {
        const tipo = lancamento.tipo;
        const url = tipo === 'receita' 
          ? `/financeiro/contas-receber` 
          : `/financeiro/contas-pagar`;
        
        return (
          <LinkComponent key={lancamento.id} href={url}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="space-y-1">
                <div className="font-medium line-clamp-1">{lancamento.descricao}</div>
                <div className="text-sm text-gray-500">
                  {format(parseISO(lancamento.data_vencimento), "dd 'de' MMM", { locale: ptBR })}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`font-medium ${tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatarMoeda(lancamento.valor)}
                </span>
                <Badge variant={tipo === 'receita' ? "outline" : "destructive"}>
                  {tipo === 'receita' ? 'Receita' : 'Despesa'}
                </Badge>
              </div>
            </div>
          </LinkComponent>
        );
      })}
    </div>
  );
}

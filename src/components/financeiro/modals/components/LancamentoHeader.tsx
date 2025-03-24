
/**
 * Componente de cabeçalho para diálogo de detalhes do lançamento financeiro
 * 
 * Exibe o título, data de criação e referência do lançamento
 */
import { LancamentoFinanceiro } from "@/types/financeiro";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LancamentoHeaderProps {
  lancamento: LancamentoFinanceiro;
}

export function LancamentoHeader({ lancamento }: LancamentoHeaderProps) {
  // Obter o mês de referência quando disponível
  const getMesReferencia = () => {
    if (lancamento.fatura?.mes && lancamento.fatura?.ano) {
      return format(new Date(lancamento.fatura.ano, lancamento.fatura.mes - 1), "MMMM/yyyy", { locale: ptBR });
    } else if (lancamento.pagamento_usina?.mes && lancamento.pagamento_usina?.ano) {
      return format(new Date(lancamento.pagamento_usina.ano, lancamento.pagamento_usina.mes - 1), "MMMM/yyyy", { locale: ptBR });
    }
    return null;
  };

  // Obter título com mês de referência se disponível
  const getTituloComReferencia = () => {
    const mesReferencia = getMesReferencia();
    if (mesReferencia) {
      return `${lancamento.descricao} - Ref: ${mesReferencia}`;
    }
    return lancamento.descricao;
  };

  return (
    <div>
      <h3 className="font-medium text-lg">{getTituloComReferencia()}</h3>
      <div className="text-sm text-gray-500">
        Criado em {format(new Date(lancamento.created_at), "dd/MM/yyyy", { locale: ptBR })}
      </div>
    </div>
  );
}

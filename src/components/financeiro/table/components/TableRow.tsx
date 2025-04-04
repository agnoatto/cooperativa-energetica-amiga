
/**
 * Componente de linha da tabela de lançamentos
 * 
 * Renderiza os dados de um lançamento financeiro em formato de linha de tabela,
 * incluindo descrição, contato, vencimento, valor, status e ações.
 */
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { formatCurrency } from "@/components/faturas/table/desktop/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "../../utils/status";
import { TableActions } from "./TableActions";

interface TableRowProps {
  lancamento: LancamentoFinanceiro;
  tipo: "receita" | "despesa";
  onViewDetails: (lancamento: LancamentoFinanceiro) => void;
}

// Função para obter o mês de referência formatado
const getMesReferencia = (lancamento: LancamentoFinanceiro) => {
  if (lancamento.fatura?.mes && lancamento.fatura?.ano) {
    return format(new Date(lancamento.fatura.ano, lancamento.fatura.mes - 1), "MMMM/yyyy", { locale: ptBR });
  } else if (lancamento.pagamento_usina?.mes && lancamento.pagamento_usina?.ano) {
    return format(new Date(lancamento.pagamento_usina.ano, lancamento.pagamento_usina.mes - 1), "MMMM/yyyy", { locale: ptBR });
  }
  return lancamento.descricao;
};

// Função para obter ID/número que identifica o lançamento
const getIdentificador = (lancamento: LancamentoFinanceiro) => {
  if (lancamento.fatura?.numero_fatura) {
    return lancamento.fatura.numero_fatura;
  } else if (lancamento.pagamento_usina?.id) {
    return `PG-${lancamento.pagamento_usina.id.substring(0, 6)}`;
  }
  return lancamento.id.substring(0, 7);
};

// Formatar a descrição conforme o mês de referência
const formatarDescricao = (lancamento: LancamentoFinanceiro) => {
  const mesReferencia = getMesReferencia(lancamento);
  const identificador = getIdentificador(lancamento);
  
  // Se é o mesmo que a descrição, significa que não tem mês de referência
  if (mesReferencia === lancamento.descricao) {
    return lancamento.descricao;
  }
  
  return `${mesReferencia} - ${identificador}`;
};

// Obter o nome do contato (cooperado ou investidor)
const getNomeContato = (lancamento: LancamentoFinanceiro, tipo: "receita" | "despesa") => {
  if (tipo === 'receita') {
    return lancamento.cooperado?.nome || '-';
  } else {
    return lancamento.investidor?.nome_investidor || '-';
  }
};

export function TableRow({ lancamento, tipo, onViewDetails }: TableRowProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        <div className="font-medium">
          {formatarDescricao(lancamento)}
        </div>
        <div className="flex gap-3 text-sm text-gray-500 mt-1">
          <div>{getNomeContato(lancamento, tipo)}</div>
          <div>•</div>
          <div>{format(new Date(lancamento.data_vencimento), 'dd/MM/yyyy')}</div>
          <div>•</div>
          <div>{formatCurrency(lancamento.valor)}</div>
          <div>
            <Badge
              variant="outline"
              className={`${getStatusColor(
                lancamento.status as StatusLancamento
              )}`}
            >
              {lancamento.status.charAt(0).toUpperCase() +
                lancamento.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>
      <div>
        <TableActions lancamento={lancamento} onViewDetails={onViewDetails} />
      </div>
    </div>
  );
}

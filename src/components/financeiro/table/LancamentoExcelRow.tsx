
/**
 * Componente de linha para a tabela Excel de lançamentos financeiros
 * 
 * Renderiza uma linha da tabela com células correspondentes às colunas visíveis.
 * Cada célula exibe conteúdo específico do tipo de dado do lançamento.
 */
import { Column } from "@/components/ui/excel-table/types";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "../utils/status";
import { TableActions } from "./components/TableActions";

interface LancamentoExcelRowProps {
  lancamento: LancamentoFinanceiro;
  columns: Column[];
  tipo: "receita" | "despesa";
  onViewDetails: (lancamento: LancamentoFinanceiro) => void;
}

export function LancamentoExcelRow({
  lancamento,
  columns,
  tipo,
  onViewDetails
}: LancamentoExcelRowProps) {
  // Funções auxiliares para formatação dos dados
  
  // Formatar a descrição conforme o mês de referência
  const formatarDescricao = () => {
    let descricao = lancamento.descricao;
    
    // Adicionar mês/ano de referência para faturas
    if (lancamento.fatura?.mes && lancamento.fatura?.ano) {
      const data = new Date(lancamento.fatura.ano, lancamento.fatura.mes - 1);
      const mesAno = format(data, "MMMM/yyyy", { locale: ptBR });
      const numeroFatura = lancamento.fatura.numero_fatura;
      descricao = `${mesAno} - ${numeroFatura}`;
    }
    // Adicionar mês/ano para pagamentos de usina
    else if (lancamento.pagamento_usina?.mes && lancamento.pagamento_usina?.ano) {
      const data = new Date(lancamento.pagamento_usina.ano, lancamento.pagamento_usina.mes - 1);
      const mesAno = format(data, "MMMM/yyyy", { locale: ptBR });
      const idAbreviado = lancamento.pagamento_usina.id?.substring(0, 6) || '';
      descricao = `${mesAno} - PG-${idAbreviado}`;
    }
    
    return descricao;
  };
  
  // Obter o nome do contato (cooperado ou investidor)
  const obterNomeContato = () => {
    if (tipo === 'receita') {
      return lancamento.cooperado?.nome || '-';
    } else {
      return lancamento.investidor?.nome_investidor || '-';
    }
  };
  
  // Formatar data de vencimento
  const formatarVencimento = () => {
    try {
      return format(parseISO(lancamento.data_vencimento), 'dd/MM/yyyy');
    } catch (e) {
      return lancamento.data_vencimento || '-';
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50/70 transition-colors">
      {columns.map(column => {
        // Renderização baseada no tipo de coluna
        switch (column.id) {
          case 'descricao':
            return (
              <td key={column.id} className="p-3 text-sm font-medium">
                {formatarDescricao()}
              </td>
            );
          
          case 'contato':
            return (
              <td key={column.id} className="p-3 text-sm truncate max-w-[180px]">
                {obterNomeContato()}
              </td>
            );
          
          case 'vencimento':
            return (
              <td key={column.id} className="p-3 text-sm text-right">
                {formatarVencimento()}
              </td>
            );
          
          case 'valor':
            return (
              <td key={column.id} className="p-3 text-sm text-right font-medium">
                {formatarMoeda(lancamento.valor)}
              </td>
            );
          
          case 'status':
            return (
              <td key={column.id} className="p-3 text-sm text-center">
                <Badge
                  variant="outline"
                  className={getStatusColor(lancamento.status as StatusLancamento)}
                >
                  {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
                </Badge>
              </td>
            );
          
          case 'acoes':
            return (
              <td key={column.id} className="p-3 text-sm">
                <TableActions 
                  lancamento={lancamento} 
                  onViewDetails={onViewDetails} 
                />
              </td>
            );
          
          default:
            return <td key={column.id} className="p-3 text-sm">-</td>;
        }
      })}
    </tr>
  );
}

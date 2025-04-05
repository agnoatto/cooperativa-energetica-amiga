
/**
 * Linha Excel para lançamentos financeiros
 * 
 * Este componente renderiza uma linha de tabela estilo Excel para lançamentos financeiros,
 * utilizando o componente TableRow para o conteúdo, mas adaptando para a estrutura da tabela Excel.
 */
import { Column } from "@/components/ui/excel-table/types";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { TableRow } from "./components/TableRow";
import { TableActions } from "./components/TableActions";
import { formatarMoeda } from "@/utils/formatters";
import { StatusBadge } from "./components/StatusBadge";
import { formatDateToPtBR } from "@/utils/dateFormatters";

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
  onViewDetails,
}: LancamentoExcelRowProps) {
  // Para mapear o comportamento de TableRow para a ExcelTable
  // implementamos a renderização de cada coluna individualmente
  
  return (
    <tr
      key={lancamento.id}
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
    >
      {columns.map((column) => {
        // Determinar o conteúdo da célula com base no ID da coluna
        let content;
        
        if (column.id === "descricao") {
          content = lancamento.descricao;
        } else if (column.id === "contato") {
          // Exibir o nome do contato baseado no tipo de lançamento
          content = tipo === 'receita' 
            ? lancamento.cooperado?.nome || '-'
            : lancamento.investidor?.nome_investidor || '-';
        } else if (column.id === "data_vencimento" || column.id === "vencimento") {
          content = formatDateToPtBR(lancamento.data_vencimento);
        } else if (column.id === "data_pagamento") {
          content = lancamento.data_pagamento ? formatDateToPtBR(lancamento.data_pagamento) : "-";
        } else if (column.id === "valor") {
          content = formatarMoeda(lancamento.valor);
        } else if (column.id === "status") {
          content = <StatusBadge status={lancamento.status} />;
        } else if (column.id === "acoes") {
          content = <TableActions lancamento={lancamento} onViewDetails={onViewDetails} />;
        } else {
          content = "-";
        }
        
        return (
          <td
            key={column.id}
            className="px-4 py-3 text-sm font-medium"
            style={{ minWidth: column.minWidth, width: column.width }}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}

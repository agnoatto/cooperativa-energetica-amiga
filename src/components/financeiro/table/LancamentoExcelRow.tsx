
/**
 * Linha Excel para lançamentos financeiros
 * 
 * Este componente renderiza uma linha de tabela estilo Excel para lançamentos financeiros,
 * utilizando o componente TableRow para o conteúdo, mas adaptando para a estrutura da tabela Excel.
 */
import { Column } from "@/components/ui/excel-table/types";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { TableRow } from "./components/TableRow";

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
  // repassamos apenas os props necessários
  
  return (
    <tr
      key={lancamento.id}
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
    >
      {columns.map((column) => {
        let content = null;
        
        if (column.id === "descricao") {
          content = (
            <TableRow
              lancamento={lancamento}
              tipo={tipo}
              onViewDetails={onViewDetails}
            />
          );
        }
        
        return (
          <td
            key={column.id}
            className="px-4 py-3 font-medium"
            style={{ minWidth: column.minWidth, width: column.width }}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}

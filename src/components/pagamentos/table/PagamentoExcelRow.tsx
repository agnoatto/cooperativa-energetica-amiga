
/**
 * Componente de linha para a tabela Excel de pagamentos
 * 
 * Renderiza uma linha da tabela com células correspondentes às colunas visíveis.
 * Cada célula exibe o conteúdo específico do tipo de dado do pagamento.
 */
import { Column } from "@/components/ui/excel-table/types";
import { PagamentoData } from "../types/pagamento";
import { formatarMoeda } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PagamentoActions } from "./PagamentosActions";
import { usePagamentoStatus } from "../hooks/usePagamentoStatus";
import { FileActions } from "../upload/FileActions";

interface PagamentoExcelRowProps {
  pagamento: PagamentoData;
  columns: Column[];
  onViewDetails: (pagamento: PagamentoData) => void;
  onEdit: (pagamento: PagamentoData) => void;
  onDelete: (pagamento: PagamentoData) => void;
}

export function PagamentoExcelRow({
  pagamento,
  columns,
  onViewDetails,
  onEdit,
  onDelete
}: PagamentoExcelRowProps) {
  const { StatusBadge, handleSendPagamento, isUpdating } = usePagamentoStatus();
  
  // Cálculo dos valores
  const valorBruto = pagamento.geracao_kwh * (pagamento.usina?.valor_kwh || 0);
  const valorEfetivo = valorBruto - pagamento.valor_tusd_fio_b - pagamento.valor_concessionaria;

  // Formatação da data
  const formattedVencimento = pagamento.data_vencimento 
    ? format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })
    : '-';

  const showFileActions = !!pagamento.arquivo_conta_energia_path;

  const handleOpenSendDialog = () => {
    console.log("Abrir diálogo de envio");
    // Implementação pode ser adicionada conforme necessário
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50/70 transition-colors">
      {columns.map(column => {
        // Renderização baseada no tipo de coluna
        switch (column.id) {
          case 'uc':
            return (
              <td key={column.id} className="p-3 text-sm">
                {pagamento.usina?.unidade_usina?.numero_uc || '-'}
              </td>
            );
          
          case 'investidor':
            return (
              <td key={column.id} className="p-3 text-sm font-medium truncate max-w-[180px]">
                {pagamento.usina?.investidor?.nome_investidor || '-'}
              </td>
            );
          
          case 'geracao':
            return (
              <td key={column.id} className="p-3 text-sm text-right">
                {pagamento.geracao_kwh.toLocaleString('pt-BR')}
              </td>
            );
          
          case 'valor_concessionaria':
            return (
              <td key={column.id} className="p-3 text-sm text-right">
                {formatarMoeda(pagamento.valor_concessionaria)}
              </td>
            );
          
          case 'valor_total':
            return (
              <td key={column.id} className="p-3 text-sm text-right">
                {formatarMoeda(valorEfetivo)}
              </td>
            );
          
          case 'vencimento':
            return (
              <td key={column.id} className="p-3 text-sm text-right">
                {formattedVencimento}
              </td>
            );
          
          case 'status':
            return (
              <td key={column.id} className="p-3 text-sm text-center">
                <StatusBadge status={pagamento.status} />
              </td>
            );
          
          case 'arquivo_conta':
            return (
              <td key={column.id} className="p-3 text-sm text-center">
                <div className="flex items-center justify-center">
                  {showFileActions ? (
                    <FileActions
                      fileName={pagamento.arquivo_conta_energia_nome}
                      filePath={pagamento.arquivo_conta_energia_path}
                      pagamentoId={pagamento.id}
                      onFileDeleted={() => console.log("Arquivo deletado")}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Não anexada</span>
                  )}
                </div>
              </td>
            );
          
          case 'acoes':
            return (
              <td key={column.id} className="p-3 text-sm">
                <PagamentoActions
                  pagamento={pagamento}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSendPagamento={pagamento.status === 'pendente' ? handleOpenSendDialog : undefined}
                  isUpdating={isUpdating}
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

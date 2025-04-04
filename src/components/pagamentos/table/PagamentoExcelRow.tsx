
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
import { usePagamentoStatus } from "../hooks/usePagamentoStatus";
import { FileActions } from "../upload/FileActions";
import { useState } from "react";
import { PagamentoActionsMenu } from "./PagamentoActionsMenu";
import { BoletimPreviewDialog } from "../BoletimPreviewDialog";
import { SendPagamentoDialog } from "../SendPagamentoDialog";
import { toast } from "sonner";

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
  const [showBoletimPreview, setShowBoletimPreview] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  
  // Cálculo dos valores
  const valorBruto = pagamento.geracao_kwh * (pagamento.usina?.valor_kwh || 0);
  const valorEfetivo = valorBruto - pagamento.valor_tusd_fio_b - pagamento.valor_concessionaria;

  // Formatação da data
  const formattedVencimento = pagamento.data_vencimento 
    ? format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })
    : '-';

  const showFileActions = !!pagamento.arquivo_conta_energia_path;

  const handleOpenSendDialog = () => {
    if (pagamento.status !== 'pendente') {
      toast.error('Este pagamento não está com status pendente');
      return;
    }
    
    if (isUpdating) {
      toast.info('Aguarde, uma operação de envio já está em andamento');
      return;
    }
    
    setShowSendDialog(true);
  };

  const handleSend = async (method: 'email' | 'whatsapp') => {
    try {
      console.log('[PagamentoExcelRow] Enviando pagamento:', pagamento.id, 'por', method);
      await handleSendPagamento(pagamento, method);
      setShowSendDialog(false);
    } catch (error) {
      console.error('[PagamentoExcelRow] Erro ao enviar pagamento:', error);
      throw error;
    }
  };

  // Função para gerar o boletim (já implementada no BoletimMedicaoButton)
  const handleGerarBoletim = async () => {
    try {
      // Todo: implementar a geração do boletim
      console.log('Gerando boletim...');
    } catch (error) {
      console.error("[Boletim] Erro ao gerar boletim:", error);
      toast.error("Erro ao gerar boletim de medição");
    }
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
                <PagamentoActionsMenu
                  pagamento={pagamento}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSendPagamento={handleOpenSendDialog}
                  onViewBoletim={() => setShowBoletimPreview(true)}
                  onDownloadBoletim={handleGerarBoletim}
                  isUpdating={isUpdating}
                  isLoadingFile={isLoadingFile}
                />
              </td>
            );
          
          default:
            return <td key={column.id} className="p-3 text-sm">-</td>;
        }
      })}

      <BoletimPreviewDialog
        isOpen={showBoletimPreview}
        onClose={() => setShowBoletimPreview(false)}
        pagamento={pagamento}
      />

      <SendPagamentoDialog
        isOpen={showSendDialog}
        onClose={() => setShowSendDialog(false)}
        onSend={handleSend}
      />
    </tr>
  );
}

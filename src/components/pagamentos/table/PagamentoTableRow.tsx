
/**
 * Componente de linha da tabela de pagamentos
 * 
 * Exibe os dados de um pagamento específico na tabela e fornece
 * botões de ação como visualizar, editar, excluir e enviar.
 */
import { Send, Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { PagamentoData } from "../types/pagamento";
import { formatarMoeda } from "@/utils/formatters";
import { usePagamentoStatus } from "../hooks/usePagamentoStatus";
import { useState } from "react";
import { BoletimPreviewDialog } from "../BoletimPreviewDialog";
import { SendPagamentoDialog } from "../SendPagamentoDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileActions } from "../upload/FileActions";
import { toast } from "sonner";

interface PagamentoTableRowProps {
  pagamento: PagamentoData;
  onEdit: (pagamento: PagamentoData) => void;
  onDelete: (pagamento: PagamentoData) => void;
  onViewDetails: (pagamento: PagamentoData) => void;
}

export function PagamentoTableRow({
  pagamento,
  onEdit,
  onDelete,
  onViewDetails,
}: PagamentoTableRowProps) {
  const { StatusBadge, handleSendPagamento, isUpdating } = usePagamentoStatus();
  const [showBoletimPreview, setShowBoletimPreview] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [isFileDeleted, setIsFileDeleted] = useState(false);
  
  const valorBruto = pagamento.geracao_kwh * (pagamento.usina?.valor_kwh || 0);
  const valorEfetivo = valorBruto - pagamento.valor_tusd_fio_b - pagamento.valor_concessionaria;

  const formattedVencimento = pagamento.data_vencimento 
    ? format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })
    : '-';

  // Determina se deve mostrar as informações do arquivo ou o estado "Não anexada"
  const showFileActions = pagamento.arquivo_conta_energia_path && !isFileDeleted;

  const handleSendClick = () => {
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
      console.log('[PagamentoTableRow] Enviando pagamento:', pagamento.id, 'por', method);
      await handleSendPagamento(pagamento, method);
      setShowSendDialog(false);
    } catch (error) {
      console.error('[PagamentoTableRow] Erro ao enviar pagamento:', error);
      throw error; // Repassar o erro para o componente de diálogo
    }
  };

  return (
    <TableRow className="border-b border-gray-200 hover:bg-gray-50/70 transition-colors">
      <TableCell className="py-3 px-4 text-sm">{pagamento.usina?.unidade_usina?.numero_uc}</TableCell>
      <TableCell className="py-3 px-4 text-sm font-medium truncate max-w-[180px]">{pagamento.usina?.investidor?.nome_investidor}</TableCell>
      <TableCell className="py-3 px-4 text-sm text-right">{pagamento.geracao_kwh.toLocaleString('pt-BR')}</TableCell>
      <TableCell className="py-3 px-4 text-sm text-right">
        {formatarMoeda(pagamento.valor_concessionaria)}
      </TableCell>
      <TableCell className="py-3 px-4 text-sm text-right">{formatarMoeda(valorEfetivo)}</TableCell>
      <TableCell className="py-3 px-4 text-sm text-right">{formattedVencimento}</TableCell>
      <TableCell className="py-3 px-4 text-sm text-right">
        <StatusBadge status={pagamento.status} />
      </TableCell>
      <TableCell className="py-3 px-4 text-sm text-center">
        <div className="flex items-center justify-center">
          {showFileActions ? (
            <FileActions
              fileName={pagamento.arquivo_conta_energia_nome}
              filePath={pagamento.arquivo_conta_energia_path}
              pagamentoId={pagamento.id}
              onFileDeleted={() => setIsFileDeleted(true)}
            />
          ) : (
            <span className="text-xs text-gray-400">Não anexada</span>
          )}
        </div>
      </TableCell>
      <TableCell className="py-3 px-4 text-sm text-right sticky right-0 bg-white shadow-[-8px_0_16px_-6px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100"
            onClick={() => onViewDetails(pagamento)}
            title="Visualizar boletim"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>

          {pagamento.status === 'pendente' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100"
              onClick={handleSendClick}
              title="Enviar boletim"
              disabled={isUpdating}
            >
              <Send className={`h-4 w-4 ${isUpdating ? 'text-gray-400 animate-pulse' : 'text-gray-600'}`} />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100"
            onClick={() => onEdit(pagamento)}
            title="Editar"
          >
            <Pencil className="h-4 w-4 text-gray-600" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100"
            onClick={() => onDelete(pagamento)}
            title="Excluir"
          >
            <Trash className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </TableCell>

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
    </TableRow>
  );
}

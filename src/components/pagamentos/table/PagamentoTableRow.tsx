
/**
 * Componente de linha da tabela de pagamentos
 * 
 * Exibe os dados de um pagamento específico na tabela e fornece
 * botões de ação como visualizar, editar, excluir e enviar.
 */
import { FileDown, Send, Eye, Pencil, Trash, FileText, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { PagamentoData, SendMethod } from "../types/pagamento";
import { formatarMoeda } from "@/utils/formatters";
import { usePagamentoStatus } from "../hooks/usePagamentoStatus";
import { useState } from "react";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BoletimPreviewDialog } from "../BoletimPreviewDialog";
import { SendPagamentoDialog } from "../SendPagamentoDialog";
import { STORAGE_BUCKET } from "../hooks/useFileState";
import { useFileState } from "../hooks/useFileState";

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
  const { StatusBadge, handleSendPagamento } = usePagamentoStatus();
  const { deleteFileFromPagamento, isDeleting } = useFileState();
  const [showContaEnergiaPreview, setShowContaEnergiaPreview] = useState(false);
  const [showBoletimPreview, setShowBoletimPreview] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const valorBruto = pagamento.geracao_kwh * (pagamento.usina?.valor_kwh || 0);
  const valorEfetivo = valorBruto - pagamento.valor_tusd_fio_b - pagamento.valor_concessionaria;

  const handlePreviewContaEnergia = async () => {
    if (pagamento.arquivo_conta_energia_path) {
      try {
        console.log('[handlePreviewContaEnergia] Tentando obter URL do arquivo:', pagamento.arquivo_conta_energia_path);
        
        // Verificar se o caminho já é uma URL completa
        if (pagamento.arquivo_conta_energia_path.startsWith('http')) {
          console.log('[handlePreviewContaEnergia] Usando URL completa existente');
          setPdfUrl(pagamento.arquivo_conta_energia_path);
        } else {
          // Tenta criar uma URL assinada primeiro
          const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(pagamento.arquivo_conta_energia_path, 3600);

          if (signedUrlError) {
            console.error('[handlePreviewContaEnergia] Erro ao gerar URL assinada:', signedUrlError);
            
            // Se falhar, tenta obter URL pública
            const { data } = await supabase
              .storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(pagamento.arquivo_conta_energia_path);
              
            console.log('[handlePreviewContaEnergia] URL pública obtida:', data.publicUrl);
            setPdfUrl(data.publicUrl);
          } else {
            console.log('[handlePreviewContaEnergia] URL assinada obtida:', signedUrlData.signedUrl);
            setPdfUrl(signedUrlData.signedUrl);
          }
        }
        
        setShowContaEnergiaPreview(true);
      } catch (error) {
        console.error('[handlePreviewContaEnergia] Erro ao obter URL do PDF:', error);
        toast.error('Erro ao carregar o PDF');
      }
    }
  };

  const handleDownloadContaEnergia = async () => {
    if (pagamento.arquivo_conta_energia_path) {
      try {
        console.log('[handleDownloadContaEnergia] Tentando baixar arquivo:', pagamento.arquivo_conta_energia_path);
        
        // Verificar se o caminho é uma URL completa
        let filePath = pagamento.arquivo_conta_energia_path;
        if (filePath.startsWith('http')) {
          // Extrair o caminho relativo da URL
          const regex = new RegExp(`/storage/v1/object/public/${STORAGE_BUCKET}/(.+)`);
          const match = filePath.match(regex);
          if (match && match[1]) {
            filePath = match[1];
            console.log(`[handleDownloadContaEnergia] Caminho extraído: ${filePath}`);
          }
        }
        
        const { data, error } = await supabase
          .storage
          .from(STORAGE_BUCKET)
          .download(filePath);

        if (error) {
          console.error('[handleDownloadContaEnergia] Erro no download:', error);
          throw error;
        }

        // Criar URL do blob e fazer download
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = pagamento.arquivo_conta_energia_nome || 'conta-energia.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        toast.success('Download iniciado');
      } catch (error) {
        console.error('[handleDownloadContaEnergia] Erro ao fazer download:', error);
        toast.error('Erro ao fazer download do arquivo');
      }
    }
  };

  const handleDeleteContaEnergia = async () => {
    if (!pagamento.arquivo_conta_energia_path) {
      return;
    }

    try {
      const success = await deleteFileFromPagamento(pagamento.id);
      if (success) {
        toast.success("Arquivo da conta de energia removido com sucesso");
        // Forçar o recarregamento dos dados
        window.location.reload();
      }
    } catch (error) {
      console.error('[handleDeleteContaEnergia] Erro ao excluir arquivo:', error);
      toast.error('Erro ao excluir arquivo da conta de energia');
    }
  };

  return (
    <TableRow className="h-9 hover:bg-gray-50">
      <TableCell className="py-1.5 px-3 text-sm">{pagamento.usina?.unidade_usina?.numero_uc}</TableCell>
      <TableCell className="py-1.5 px-3 text-sm font-medium truncate max-w-[180px]">{pagamento.usina?.investidor?.nome_investidor}</TableCell>
      <TableCell className="py-1.5 px-3 text-sm text-right">{pagamento.geracao_kwh}</TableCell>
      <TableCell className="py-1.5 px-3 text-sm text-right">
        {formatarMoeda(pagamento.valor_concessionaria)}
      </TableCell>
      <TableCell className="py-1.5 px-3 text-sm text-right">{formatarMoeda(valorEfetivo)}</TableCell>
      <TableCell className="py-1.5 px-3 text-sm text-right">
        <StatusBadge status={pagamento.status} />
      </TableCell>
      <TableCell className="py-1.5 px-3 text-sm text-center">
        <div className="flex items-center justify-center space-x-1">
          {pagamento.arquivo_conta_energia_path ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handlePreviewContaEnergia}
                title="Visualizar conta"
              >
                <FileText className="h-4 w-4 text-gray-600" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleDownloadContaEnergia}
                title="Baixar conta"
              >
                <FileDown className="h-4 w-4 text-gray-600" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleDeleteContaEnergia}
                disabled={isDeleting}
                title="Excluir conta"
              >
                <FileX className="h-4 w-4 text-red-500" />
              </Button>
            </>
          ) : (
            <span className="text-xs text-gray-400">Não anexada</span>
          )}
        </div>
      </TableCell>
      <TableCell className="py-1.5 px-3 text-sm text-right">
        <div className="flex items-center justify-end space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowBoletimPreview(true)}
            title="Visualizar boletim"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>

          {pagamento.status === 'pendente' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowSendDialog(true)}
              title="Enviar boletim"
            >
              <Send className="h-4 w-4 text-gray-600" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(pagamento)}
            title="Editar"
          >
            <Pencil className="h-4 w-4 text-gray-600" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onDelete(pagamento)}
            title="Excluir"
          >
            <Trash className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </TableCell>

      {/* Modais */}
      <PdfPreview 
        isOpen={showContaEnergiaPreview}
        onClose={() => {
          setShowContaEnergiaPreview(false);
          setPdfUrl(null);
        }}
        pdfUrl={pdfUrl}
      />

      <BoletimPreviewDialog
        isOpen={showBoletimPreview}
        onClose={() => setShowBoletimPreview(false)}
        pagamento={pagamento}
      />

      <SendPagamentoDialog
        isOpen={showSendDialog}
        onClose={() => setShowSendDialog(false)}
        onSend={async (method) => {
          try {
            await handleSendPagamento(pagamento, method);
            setShowSendDialog(false);
          } catch (error) {
            console.error('Erro ao enviar boletim:', error);
            toast.error('Erro ao enviar boletim');
          }
        }}
      />
    </TableRow>
  );
}

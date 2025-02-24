
import { format } from "date-fns";
import { FileDown, Send, Eye, Pencil, Trash, FileText } from "lucide-react";
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
import { STORAGE_BUCKET } from "../hooks/constants";

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
        
        const { data, error } = await supabase
          .storage
          .from(STORAGE_BUCKET)
          .download(pagamento.arquivo_conta_energia_path);

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

  return (
    <TableRow>
      <TableCell>{pagamento.usina?.unidade_usina?.numero_uc}</TableCell>
      <TableCell>{pagamento.usina?.investidor?.nome_investidor}</TableCell>
      <TableCell className="text-right">{pagamento.geracao_kwh}</TableCell>
      <TableCell className="text-right">
        {formatarMoeda(pagamento.valor_concessionaria)}
      </TableCell>
      <TableCell className="text-right">{formatarMoeda(valorEfetivo)}</TableCell>
      <TableCell className="text-right">
        <StatusBadge status={pagamento.status} />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider>
            {pagamento.arquivo_conta_energia_path && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handlePreviewContaEnergia}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Visualizar Conta</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleDownloadContaEnergia}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Conta</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowBoletimPreview(true)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visualizar Boletim</p>
              </TooltipContent>
            </Tooltip>

            {pagamento.status === 'pendente' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowSendDialog(true)}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enviar Boletim</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(pagamento)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDelete(pagamento)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Excluir</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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

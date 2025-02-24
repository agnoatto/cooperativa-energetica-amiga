import { format } from "date-fns";
import { FileDown, Send, Eye, Pencil, Trash, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { PagamentoData } from "../types/pagamento";
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

  const handleSend = async (method: 'email' | 'whatsapp') => {
    try {
      await handleSendPagamento(pagamento, method);
      setShowSendDialog(false);
    } catch (error) {
      console.error('Erro ao enviar boletim:', error);
    }
  };

  const handleViewContaEnergia = async () => {
    try {
      if (!pagamento.arquivo_conta_energia_path) return;

      const { data, error } = await supabase.storage
        .from('pagamentos')
        .createSignedUrl(pagamento.arquivo_conta_energia_path, 60);

      if (error) {
        console.error('Erro ao gerar URL da conta de energia:', error);
        toast.error('Erro ao carregar conta de energia');
        return;
      }

      setPdfUrl(data.signedUrl);
      setShowContaEnergiaPreview(true);
    } catch (error) {
      console.error('Erro ao visualizar conta de energia:', error);
      toast.error('Erro ao carregar conta de energia');
    }
  };

  const handleDownloadContaEnergia = async () => {
    try {
      if (!pagamento.arquivo_conta_energia_path || !pagamento.arquivo_conta_energia_nome) return;

      const { data, error } = await supabase.storage
        .from('pagamentos')
        .download(pagamento.arquivo_conta_energia_path);

      if (error) {
        console.error('Erro ao baixar conta de energia:', error);
        toast.error('Erro ao baixar conta de energia');
        return;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = pagamento.arquivo_conta_energia_nome;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar conta de energia:', error);
      toast.error('Erro ao baixar conta de energia');
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
                  <p>Baixar conta de energia</p>
                </TooltipContent>
              </Tooltip>
            )}

            {pagamento.arquivo_conta_energia_path && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleViewContaEnergia}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visualizar conta de energia</p>
                </TooltipContent>
              </Tooltip>
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
                  onClick={() => onViewDetails(pagamento)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver detalhes</p>
              </TooltipContent>
            </Tooltip>

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
                  className="h-8 w-8 text-destructive hover:text-destructive"
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
        onSend={handleSend}
      />
    </TableRow>
  );
}

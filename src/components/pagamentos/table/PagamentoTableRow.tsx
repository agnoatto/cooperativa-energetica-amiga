
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { FileText, CheckCircle2 } from "lucide-react";
import { PagamentoData } from "../types/pagamento";
import { formatCurrency } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";
import { SIGNED_URL_EXPIRY, STORAGE_BUCKET } from '../hooks/constants';
import { PagamentoActions } from "./PagamentoActions";
import { sanitizeFileName } from "../hooks/utils/fileValidation";

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
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleViewFile = async () => {
    if (!pagamento.arquivo_conta_energia_path) {
      console.log("[PagamentoTableRow] Nenhum arquivo para visualizar");
      return;
    }
    
    setIsLoadingFile(true);
    try {
      console.log("[PagamentoTableRow] Tentando gerar URL de preview para:", {
        path: pagamento.arquivo_conta_energia_path,
        nome: pagamento.arquivo_conta_energia_nome,
        tipo: pagamento.arquivo_conta_energia_tipo
      });
      
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(pagamento.arquivo_conta_energia_path, SIGNED_URL_EXPIRY);

      if (error) {
        console.error("[PagamentoTableRow] Erro ao gerar URL assinada:", error);
        throw new Error(`Erro ao gerar URL assinada: ${error.message}`);
      }

      if (!data?.signedUrl) {
        throw new Error('URL assinada não gerada');
      }

      console.log("[PagamentoTableRow] URL de preview gerada com sucesso:", data.signedUrl);
      setPdfUrl(data.signedUrl);
      setShowPdfPreview(true);
    } catch (error: any) {
      console.error('[PagamentoTableRow] Erro ao carregar arquivo:', error);
      toast.error('Erro ao carregar o arquivo. Por favor, tente novamente.');
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleDownloadFile = async () => {
    if (!pagamento.arquivo_conta_energia_path || !pagamento.arquivo_conta_energia_nome) {
      console.log("[PagamentoTableRow] Nenhum arquivo para download");
      return;
    }

    setIsLoadingFile(true);
    try {
      console.log("[PagamentoTableRow] Iniciando download:", pagamento.arquivo_conta_energia_path);
      
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(pagamento.arquivo_conta_energia_path);

      if (error) {
        console.error("[PagamentoTableRow] Erro no download:", error);
        throw new Error(`Erro no download: ${error.message}`);
      }

      // Criar URL do blob e iniciar download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = sanitizeFileName(pagamento.arquivo_conta_energia_nome);
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("[PagamentoTableRow] Download concluído com sucesso");
    } catch (error: any) {
      console.error('[PagamentoTableRow] Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar o arquivo. Por favor, tente novamente.');
    } finally {
      setIsLoadingFile(false);
    }
  };

  return (
    <TableRow>
      <TableCell>{pagamento.usina.unidade_usina.numero_uc}</TableCell>
      <TableCell>{pagamento.usina.investidor.nome_investidor}</TableCell>
      <TableCell className="text-right">
        {pagamento.geracao_kwh.toLocaleString('pt-BR')}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(pagamento.valor_concessionaria)}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(pagamento.valor_total)}
      </TableCell>
      <TableCell className="text-right">{pagamento.status}</TableCell>
      <TableCell className="text-center">
        {pagamento.arquivo_conta_energia_path ? (
          <div className="flex justify-center">
            <button
              onClick={handleViewFile}
              className="text-blue-500 hover:text-blue-700"
              disabled={isLoadingFile}
            >
              <CheckCircle2 className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <PagamentoActions
          pagamento={pagamento}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewFile={handleViewFile}
          onDownloadFile={handleDownloadFile}
          isLoadingFile={isLoadingFile}
        />
      </TableCell>

      <PdfPreview
        isOpen={showPdfPreview}
        onClose={() => {
          setShowPdfPreview(false);
          setPdfUrl(null);
        }}
        pdfUrl={pdfUrl}
      />
    </TableRow>
  );
}

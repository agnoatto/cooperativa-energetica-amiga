
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, FileText, Loader2 } from "lucide-react";
import { PagamentoData } from "../types/pagamento";
import { formatCurrency } from "@/utils/formatters";
import { BoletimMedicaoButton } from "../BoletimMedicaoButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";
import { SIGNED_URL_EXPIRY, STORAGE_BUCKET } from '../hooks/constants';

interface PagamentoTableRowProps {
  pagamento: PagamentoData;
  onEdit: (pagamento: PagamentoData) => void;
  onDelete: (pagamento: PagamentoData) => void;
  onViewDetails: (pagamento: PagamentoData) => void;
  getPagamentosUltimos12Meses: (pagamento: PagamentoData) => Promise<PagamentoData[]>;
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
      console.log("[PagamentoTableRow] Gerando URL de preview para:", pagamento.arquivo_conta_energia_path);
      
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(pagamento.arquivo_conta_energia_path, SIGNED_URL_EXPIRY);

      if (error) {
        console.error("[PagamentoTableRow] Erro ao gerar URL assinada:", error);
        throw error;
      }

      console.log("[PagamentoTableRow] URL de preview gerada com sucesso");
      setPdfUrl(data.signedUrl);
      setShowPdfPreview(true);
    } catch (error) {
      console.error('[PagamentoTableRow] Erro ao carregar arquivo:', error);
      toast.error('Erro ao carregar o arquivo');
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
      <TableCell>
        {pagamento.arquivo_conta_energia_path ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleViewFile}
            disabled={isLoadingFile}
            title="Visualizar conta de energia"
          >
            {isLoadingFile ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 text-blue-500" />
            )}
          </Button>
        ) : (
          <div className="w-9 h-9 flex items-center justify-center">
            <FileText className="h-4 w-4 text-gray-300" />
          </div>
        )}
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onViewDetails(pagamento)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(pagamento)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(pagamento)}
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <BoletimMedicaoButton 
          pagamento={pagamento}
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

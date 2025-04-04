
/**
 * Componente para exibição e visualização do arquivo da concessionária
 * 
 * Este componente mostra um botão para visualizar o arquivo da fatura da concessionária
 * quando disponível, ou uma mensagem indicando que não há arquivo anexado.
 */
import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";
import { toast } from "sonner";
import { STORAGE_BUCKET } from "@/components/faturas/upload/constants";

interface ArquivoConcessionariaProps {
  arquivoPath: string | null;
  onViewPdf?: () => void; // Simplificado para aceitar uma função sem retorno
}

export function ArquivoConcessionaria({ arquivoPath, onViewPdf }: ArquivoConcessionariaProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const handleViewArquivo = () => {
    if (!arquivoPath) {
      toast.error("Nenhum arquivo de fatura disponível");
      return;
    }
    
    // Se onViewPdf for fornecido, use-o
    if (onViewPdf) {
      onViewPdf();
      return;
    }
    
    // Caso contrário, use o comportamento padrão
    console.log("[ArquivoConcessionaria] Abrindo visualização da fatura:", arquivoPath);
    setShowPdfPreview(true);
  };

  return (
    <>
      {arquivoPath ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary"
          onClick={handleViewArquivo}
          title="Ver fatura concessionária"
        >
          <FileText className="h-4 w-4" />
        </Button>
      ) : (
        <span className="text-xs text-gray-400">Não anexada</span>
      )}

      {/* O componente PdfPreview só é exibido se estamos usando o comportamento padrão */}
      {showPdfPreview && !onViewPdf && (
        <PdfPreview
          isOpen={showPdfPreview}
          onClose={() => setShowPdfPreview(false)}
          pdfUrl={arquivoPath}
          title="Visualização da Conta de Energia"
          bucketName={STORAGE_BUCKET}
        />
      )}
    </>
  );
}


/**
 * Componente para lidar com a visualização de PDFs
 * 
 * Este componente gerencia a lógica de visualização de PDFs da fatura,
 * incluindo geração de relatórios e visualização de faturas da concessionária.
 */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { FaturaPDF } from "@/components/faturas/pdf/FaturaPDF";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";
import { Fatura } from "@/types/fatura";

interface PdfVisualizationHandlerProps {
  fatura: Fatura;
}

export function PdfVisualizationHandler({ fatura }: PdfVisualizationHandlerProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isConcessionariaPreview, setIsConcessionariaPreview] = useState(false);

  // Limpar URL do PDF quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (pdfBlobUrl && pdfBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  const handleViewConcessionaria = () => {
    if (!fatura.arquivo_concessionaria_path) {
      toast.error("Nenhum arquivo de fatura disponível");
      return;
    }
    
    console.log("Visualizando fatura da concessionária:", fatura.arquivo_concessionaria_path);
    setIsConcessionariaPreview(true);
    setPdfBlobUrl(null); // Limpar qualquer URL de relatório anterior
    setShowPdfPreview(true);
  };

  const handleViewRelatorio = async () => {
    setIsGeneratingPdf(true);
    
    try {
      if (!fatura || !fatura.unidade_beneficiaria) {
        toast.error("Dados da fatura incompletos");
        return;
      }
      
      console.log("Gerando PDF do relatório mensal");
      const blob = await pdf(<FaturaPDF fatura={fatura} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      setPdfBlobUrl(url);
      setIsConcessionariaPreview(false);
      setShowPdfPreview(true);
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      toast.error(`Erro ao gerar PDF: ${error.message}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleClosePdfPreview = () => {
    console.log("Fechando previsualização PDF");
    setShowPdfPreview(false);
    
    // Limpar URL do blob se existir ao fechar
    if (pdfBlobUrl && pdfBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  return {
    showPdfPreview,
    pdfBlobUrl,
    isConcessionariaPreview,
    isGeneratingPdf,
    handleViewConcessionaria,
    handleViewRelatorio,
    handleClosePdfPreview
  };
}


import { useState, useEffect } from "react";
import { SimplePdfViewer } from "./SimplePdfViewer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET } from "./constants";

interface PdfPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title?: string;
  isRelatorio?: boolean;
}

export function PdfPreview({ 
  isOpen, 
  onClose, 
  pdfUrl, 
  title = "Visualização da Conta de Energia",
  isRelatorio = false 
}: PdfPreviewProps) {
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const processUrl = async () => {
      if (!isOpen || !pdfUrl) return;
      
      setIsLoading(true);
      setError(null);
      console.log("[PdfPreview] Processando URL:", pdfUrl);
      
      try {
        // Se for um relatório gerado (blob URL)
        if (isRelatorio || pdfUrl.startsWith('blob:')) {
          console.log("[PdfPreview] URL é um blob ou relatório gerado");
          setProcessedUrl(pdfUrl);
          return;
        }
        
        // Se for uma URL absoluta (já com http)
        if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
          console.log("[PdfPreview] URL absoluta detectada:", pdfUrl);
          setProcessedUrl(pdfUrl);
          return;
        }
        
        // Se for uma URL do servidor para geração de PDF
        if (pdfUrl.startsWith('/')) {
          console.log("[PdfPreview] URL relativa detectada:", pdfUrl);
          setProcessedUrl(pdfUrl);
          return;
        }
          
        // É um caminho do Storage do Supabase
        console.log("[PdfPreview] Gerando URL para arquivo do Supabase:", pdfUrl);
        
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(pdfUrl, 3600);
          
        if (error) {
          console.error("[PdfPreview] Erro ao criar URL assinada:", error);
          
          // Tentar uma abordagem alternativa se o caminho não for encontrado
          if (error.message === "Object not found" && !pdfUrl.startsWith('faturas/')) {
            console.log("[PdfPreview] Tentando com prefixo 'faturas/'");
            const alternativePath = `faturas/${pdfUrl}`;
            const alternativeResult = await supabase.storage
              .from(STORAGE_BUCKET)
              .createSignedUrl(alternativePath, 3600);
              
            if (!alternativeResult.error && alternativeResult.data?.signedUrl) {
              console.log("[PdfPreview] URL alternativa gerada com sucesso");
              setProcessedUrl(alternativeResult.data.signedUrl);
              return;
            }
          }
          
          throw error;
        }
        
        if (data?.signedUrl) {
          console.log("[PdfPreview] URL assinada gerada com sucesso:", data.signedUrl);
          setProcessedUrl(data.signedUrl);
        } else {
          throw new Error("Não foi possível gerar a URL assinada");
        }
      } catch (error: any) {
        console.error("[PdfPreview] Erro ao processar URL do PDF:", error);
        setError(error.message || 'Arquivo não encontrado');
        toast.error(`Erro ao carregar o PDF: ${error.message || 'Arquivo não encontrado'}`);
        setProcessedUrl(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    processUrl();
  }, [isOpen, pdfUrl, isRelatorio]);
  
  return (
    <SimplePdfViewer
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setProcessedUrl(null);
        setError(null);
      }}
      pdfUrl={processedUrl}
      title={title}
      allowDownload={true}
      isInitialLoading={isLoading}
      error={error}
    />
  );
}

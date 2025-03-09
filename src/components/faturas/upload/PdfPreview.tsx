
import { useState, useEffect } from "react";
import { SimplePdfViewer } from "./SimplePdfViewer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET as FATURAS_BUCKET } from "./constants";

interface PdfPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title?: string;
  isRelatorio?: boolean;
  bucketName?: string; // Nome do bucket para permitir visualização de diferentes origens
}

export function PdfPreview({ 
  isOpen, 
  onClose, 
  pdfUrl, 
  title = "Visualização da Conta de Energia",
  isRelatorio = false,
  bucketName
}: PdfPreviewProps) {
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Determinar qual bucket usar - usando o fornecido ou o default das faturas
  const storageBucket = bucketName || FATURAS_BUCKET;
  
  useEffect(() => {
    // Apenas processa o URL quando o modal estiver aberto e um URL for fornecido
    if (!isOpen || !pdfUrl) return;
    
    const processUrl = async () => {
      setIsLoading(true);
      setError(null);
      console.log("[PdfPreview] Iniciando processamento de URL:", pdfUrl);
      console.log("[PdfPreview] Usando bucket:", storageBucket);
      
      try {
        // Caso 1: Se for um relatório gerado ou blob URL, use diretamente
        if (isRelatorio || pdfUrl.startsWith('blob:')) {
          console.log("[PdfPreview] URL é um relatório/blob, usando diretamente");
          setProcessedUrl(pdfUrl);
          return;
        }
        
        // Caso 2: Se for uma URL absoluta (http/https), use diretamente
        if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
          console.log("[PdfPreview] URL absoluta detectada, usando diretamente");
          setProcessedUrl(pdfUrl);
          return;
        }
        
        // Caso 3: URL relativa da API, use diretamente
        if (pdfUrl.startsWith('/')) {
          console.log("[PdfPreview] URL relativa detectada, usando diretamente");
          setProcessedUrl(pdfUrl);
          return;
        }
        
        // Caso 4: Caminho do Storage do Supabase - precisamos gerar URL assinada
        // Tentar diferentes formatos de caminho para encontrar o arquivo
        let successUrl = null;
        let lastError = null;
        
        // Tentativa direta com o caminho fornecido
        try {
          console.log(`[PdfPreview] Tentando gerar URL assinada para: ${pdfUrl} no bucket: ${storageBucket}`);
          
          const { data, error } = await supabase.storage
            .from(storageBucket)
            .createSignedUrl(pdfUrl, 3600);
            
          if (error) {
            console.warn(`[PdfPreview] Erro ao criar URL assinada:`, error);
            lastError = error;
          } else if (data?.signedUrl) {
            console.log(`[PdfPreview] URL assinada gerada com sucesso:`, data.signedUrl);
            successUrl = data.signedUrl;
          }
        } catch (error) {
          console.warn(`[PdfPreview] Erro ao processar URL:`, error);
          lastError = error;
        }
        
        if (successUrl) {
          setProcessedUrl(successUrl);
        } else {
          throw new Error(lastError?.message || "Não foi possível encontrar o arquivo");
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
  }, [isOpen, pdfUrl, isRelatorio, storageBucket]);
  
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

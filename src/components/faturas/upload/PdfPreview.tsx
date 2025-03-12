
/**
 * Componente para visualização de PDFs
 * 
 * Este componente permite visualizar arquivos PDF em um modal com opções
 * de zoom, rotação e download.
 */

import { useState, useEffect } from "react";
import { SimplePdfViewer } from "./SimplePdfViewer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET as FATURAS_BUCKET } from "./constants";
import { STORAGE_BUCKET as ENERGIA_BUCKET } from "@/components/pagamentos/hooks/constants";

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
  
  // Determinar qual bucket usar - usando o fornecido ou autodetectar baseado na URL
  const detectBucket = (url: string): string => {
    if (bucketName) return bucketName;
    
    if (url.includes('contas-energia-usina')) {
      return ENERGIA_BUCKET;
    } else {
      return FATURAS_BUCKET;
    }
  };
  
  useEffect(() => {
    // Apenas processa o URL quando o modal estiver aberto e um URL for fornecido
    if (!isOpen || !pdfUrl) return;
    
    const processUrl = async () => {
      setIsLoading(true);
      setError(null);
      console.log("[PdfPreview] Iniciando processamento de URL:", pdfUrl);
      
      try {
        // Caso 1: Se for um relatório gerado ou blob URL, use diretamente
        if (isRelatorio || pdfUrl.startsWith('blob:')) {
          console.log("[PdfPreview] URL é um relatório/blob, usando diretamente");
          setProcessedUrl(pdfUrl);
          return;
        }
        
        // Caso 2: Se for uma URL absoluta (http/https), limpar possível duplicação
        if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
          console.log("[PdfPreview] URL absoluta detectada");
          
          // Corrigir problema de URL duplicada
          if (pdfUrl.includes('/storage/v1/object/public/') && pdfUrl.indexOf('/storage/v1/object/public/') !== pdfUrl.lastIndexOf('/storage/v1/object/public/')) {
            console.log("[PdfPreview] Detectada URL duplicada, corrigindo...");
            const matches = pdfUrl.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
            
            if (matches && matches.length >= 3) {
              const bucket = matches[1];
              const path = matches[2];
              
              console.log(`[PdfPreview] Bucket extraído: ${bucket}, Caminho: ${path}`);
              
              // Construir URL limpa com o bucket correto
              const storageBucket = detectBucket(pdfUrl);
              // Obtém URL base usando configs do Supabase
              const baseUrl = new URL(supabase.url).origin;
              const cleanUrl = `${baseUrl}/storage/v1/object/public/${storageBucket}/${path}`;
              console.log("[PdfPreview] URL limpa:", cleanUrl);
              setProcessedUrl(cleanUrl);
              return;
            }
          }
          
          // Se não encontrou duplicação, usar a URL diretamente
          console.log("[PdfPreview] Usando URL absoluta diretamente:", pdfUrl);
          setProcessedUrl(pdfUrl);
          return;
        }
        
        // Caso 3: URL relativa da API, use diretamente
        if (pdfUrl.startsWith('/')) {
          console.log("[PdfPreview] URL relativa detectada, usando diretamente");
          setProcessedUrl(pdfUrl);
          return;
        }
        
        // Caso 4: Caminho do Storage do Supabase - precisamos gerar URL pública
        const storageBucket = detectBucket(pdfUrl);
        console.log(`[PdfPreview] Usando bucket: ${storageBucket}`);
            
        console.log(`[PdfPreview] Gerando URL pública para: ${pdfUrl}`);
        const { data } = await supabase.storage
          .from(storageBucket)
          .getPublicUrl(pdfUrl);
            
        if (data?.publicUrl) {
          console.log(`[PdfPreview] URL pública gerada: ${data.publicUrl}`);
          setProcessedUrl(data.publicUrl);
        } else {
          throw new Error("Não foi possível gerar URL pública");
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
  }, [isOpen, pdfUrl, isRelatorio, bucketName]);
  
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

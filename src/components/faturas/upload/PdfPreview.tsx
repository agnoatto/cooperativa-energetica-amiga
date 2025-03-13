
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
  
  useEffect(() => {
    // Apenas processa o URL quando o modal estiver aberto e um URL for fornecido
    if (!isOpen || !pdfUrl) return;
    
    const processUrl = async () => {
      setIsLoading(true);
      setError(null);
      console.log("[PdfPreview] Iniciando processamento de URL:", pdfUrl);
      
      try {
        // Abordagem simplificada para obter URL pública
        // Caso 1: Se já for uma URL completa (começa com http), usamos diretamente
        if (pdfUrl.startsWith('http')) {
          console.log("[PdfPreview] Usando URL HTTP diretamente:", pdfUrl);
          setProcessedUrl(pdfUrl);
          return;
        }
        
        // Caso 2: Se for um blob, usamos diretamente
        if (pdfUrl.startsWith('blob:')) {
          console.log("[PdfPreview] Usando URL blob diretamente:", pdfUrl);
          setProcessedUrl(pdfUrl);
          return;
        }
        
        // Caso 3: Se for um relatório, usamos diretamente
        if (isRelatorio) {
          console.log("[PdfPreview] Usando URL de relatório diretamente:", pdfUrl);
          setProcessedUrl(pdfUrl);
          return;
        }
        
        // Caso 4: Caminho do Storage do Supabase - determinamos o bucket e geramos URL pública
        const selectedBucket = bucketName || 
          (pdfUrl.includes('contas-energia') ? ENERGIA_BUCKET : FATURAS_BUCKET);
          
        console.log(`[PdfPreview] Gerando URL pública usando bucket ${selectedBucket} para: ${pdfUrl}`);
        
        const { data } = supabase.storage
          .from(selectedBucket)
          .getPublicUrl(pdfUrl);
            
        console.log("[PdfPreview] URL pública gerada:", data.publicUrl);
        setProcessedUrl(data.publicUrl);
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

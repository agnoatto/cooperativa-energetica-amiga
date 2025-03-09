
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

  useEffect(() => {
    const processUrl = async () => {
      if (!isOpen || !pdfUrl) return;
      
      setIsLoading(true);
      
      try {
        // Verifica se é um blob URL (usado para PDF gerado na hora)
        if (pdfUrl.startsWith('blob:')) {
          setProcessedUrl(pdfUrl);
        } 
        // Verifica se é um caminho do Supabase Storage ou uma URL relativa
        else if (pdfUrl.startsWith('/')) {
          // É uma URL relativa para geração de PDF no servidor
          setProcessedUrl(pdfUrl);
        } else {
          // É um caminho do Storage do Supabase
          const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(pdfUrl, 3600);
            
          if (error) throw error;
          
          if (data?.signedUrl) {
            setProcessedUrl(data.signedUrl);
          } else {
            throw new Error("Não foi possível gerar a URL assinada");
          }
        }
      } catch (error: any) {
        console.error("Erro ao processar URL do PDF:", error);
        toast.error(`Erro ao carregar o PDF: ${error.message}`);
        setProcessedUrl(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    processUrl();
  }, [isOpen, pdfUrl]);
  
  return (
    <SimplePdfViewer
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setProcessedUrl(null);
      }}
      pdfUrl={processedUrl}
      title={title}
      allowDownload={true}
      isInitialLoading={isLoading}
    />
  );
}

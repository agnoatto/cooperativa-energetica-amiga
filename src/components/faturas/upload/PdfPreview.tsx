
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
        
        // Verificar primeiro se o bucket existe
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          console.error("[PdfPreview] Erro ao listar buckets:", bucketsError);
          throw new Error(`Erro ao verificar buckets: ${bucketsError.message}`);
        }
        
        const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
        if (!bucketExists) {
          console.error(`[PdfPreview] Bucket '${STORAGE_BUCKET}' não existe!`);
          throw new Error(`Bucket de armazenamento '${STORAGE_BUCKET}' não encontrado`);
        }
        
        console.log(`[PdfPreview] Bucket '${STORAGE_BUCKET}' verificado com sucesso`);
        
        // Tentar diferentes formatos de caminho para encontrar o arquivo
        // Ordem das tentativas:
        // 1. Caminho original sem modificação
        // 2. Caminho com prefixo "faturas/" adicionado
        
        const pathsToTry = [
          pdfUrl,
          pdfUrl.startsWith('faturas/') ? pdfUrl : `faturas/${pdfUrl}`
        ];
        
        let successUrl = null;
        let lastError = null;
        
        for (const path of pathsToTry) {
          console.log(`[PdfPreview] Tentando caminho: ${path}`);
          
          try {
            // Verificar se o arquivo existe antes de criar URL assinada
            const { data: fileExists, error: fileExistsError } = await supabase.storage
              .from(STORAGE_BUCKET)
              .list(path.split('/').slice(0, -1).join('/') || undefined);
              
            if (fileExistsError) {
              console.warn(`[PdfPreview] Erro ao verificar existência do caminho: ${path}`, fileExistsError);
              continue;
            }
            
            const fileName = path.split('/').pop();
            const fileFound = fileExists?.some(file => file.name === fileName);
            
            if (!fileFound) {
              console.warn(`[PdfPreview] Arquivo não encontrado em: ${path}`);
              continue;
            }
            
            // Arquivo existe, criar URL assinada
            const { data, error } = await supabase.storage
              .from(STORAGE_BUCKET)
              .createSignedUrl(path, 3600);
              
            if (error) {
              console.warn(`[PdfPreview] Erro ao criar URL assinada para: ${path}`, error);
              lastError = error;
              continue;
            }
            
            if (data?.signedUrl) {
              console.log(`[PdfPreview] URL assinada gerada com sucesso para: ${path}`);
              successUrl = data.signedUrl;
              break;
            }
          } catch (error) {
            console.warn(`[PdfPreview] Erro ao processar caminho: ${path}`, error);
            lastError = error;
          }
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

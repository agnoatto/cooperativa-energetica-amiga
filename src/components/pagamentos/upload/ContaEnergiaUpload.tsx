
/**
 * Componente para upload e visualização de arquivos de contas de energia
 * 
 * Este componente permite fazer upload, visualizar, baixar e remover arquivos
 * de contas de energia associados a um pagamento de usina.
 */

import { useCallback, useState } from "react";
import { UploadDropZone } from "@/components/faturas/upload/UploadDropZone";
import { FilePreview } from "@/components/faturas/upload/FilePreview";
import { toast } from "sonner";

interface ContaEnergiaUploadProps {
  pagamentoId: string;
  arquivoNome?: string | null;
  arquivoPath?: string | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onPreview: () => void;
}

export function ContaEnergiaUpload({
  pagamentoId,
  arquivoNome,
  arquivoPath,
  isUploading,
  onUpload,
  onRemove,
  onPreview
}: ContaEnergiaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Adaptamos a função handleDrop para receber um array de arquivos
  // mas continuamos a usar apenas o primeiro arquivo
  const handleDrop = useCallback((files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0]; // Pegamos apenas o primeiro arquivo
    console.log("[ContaEnergiaUpload] Arquivo recebido para upload:", file.name);
    
    // Verificar se o arquivo é um PDF
    if (file.type !== 'application/pdf') {
      toast.error("Apenas arquivos PDF são permitidos");
      return;
    }
    
    // Verificar o tamanho do arquivo (limite de 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      toast.error("O arquivo não pode ser maior que 10MB");
      return;
    }
    
    onUpload(file);
  }, [onUpload]);

  const handleDragStateChange = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!arquivoPath || !arquivoNome) {
      console.log("[ContaEnergiaUpload] Tentativa de download sem arquivo ou nome definido");
      return;
    }

    try {
      console.log("[ContaEnergiaUpload] Iniciando download do arquivo:", arquivoPath);
      window.open(arquivoPath, '_blank');
      toast.success("Download iniciado");
    } catch (error: any) {
      console.error('[ContaEnergiaUpload] Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  }, [arquivoPath, arquivoNome]);

  return (
    <div className="space-y-4">
      {!arquivoNome && (
        <UploadDropZone
          isUploading={isUploading}
          isDragging={isDragging}
          onDrop={handleDrop}
          onDragStateChange={handleDragStateChange}
        />
      )}

      {arquivoNome && arquivoPath && (
        <FilePreview
          fileName={arquivoNome}
          onPreview={onPreview}
          onDownload={handleDownload}
          onRemove={onRemove}
          className="bg-muted"
        />
      )}
    </div>
  );
}

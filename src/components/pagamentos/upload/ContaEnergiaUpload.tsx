
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
      // Implementação do download aqui
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

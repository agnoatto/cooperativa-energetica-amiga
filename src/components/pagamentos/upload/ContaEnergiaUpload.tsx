
import { useCallback, useState } from "react";
import { UploadDropZone } from "@/components/faturas/upload/UploadDropZone";
import { FilePreview } from "@/components/faturas/upload/FilePreview";
import { supabase } from "@/integrations/supabase/client";
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

  const handleDrop = useCallback((file: File) => {
    onUpload(file);
  }, [onUpload]);

  const handleDragStateChange = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!arquivoPath || !arquivoNome) return;

    try {
      const { data, error } = await supabase.storage
        .from('contas-energia')
        .download(arquivoPath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivoNome;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
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

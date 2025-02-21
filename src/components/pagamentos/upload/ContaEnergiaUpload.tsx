
import { useCallback } from "react";
import { UploadDropZone } from "@/components/faturas/upload/UploadDropZone";
import { FilePreview } from "@/components/faturas/upload/FilePreview";

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
  const handleDrop = useCallback((file: File) => {
    onUpload(file);
  }, [onUpload]);

  return (
    <div className="space-y-4">
      {!arquivoNome && (
        <UploadDropZone
          isUploading={isUploading}
          onDrop={handleDrop}
        />
      )}

      {arquivoNome && arquivoPath && (
        <FilePreview
          fileName={arquivoNome}
          onPreview={onPreview}
          onRemove={onRemove}
          className="bg-muted"
        />
      )}
    </div>
  );
}

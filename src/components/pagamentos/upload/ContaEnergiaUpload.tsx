
import { useCallback } from "react";
import { useFileUpload } from "./useFileUpload";
import { UploadDropZone } from "@/components/faturas/upload/UploadDropZone";
import { FilePreview } from "@/components/faturas/upload/FilePreview";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";

interface ContaEnergiaUploadProps {
  pagamentoId: string;
  arquivoNome?: string | null;
  arquivoPath?: string | null;
  onSuccess: (fileName: string, filePath: string) => void;
  onFileRemoved: () => void;
}

export function ContaEnergiaUpload({
  pagamentoId,
  arquivoNome,
  arquivoPath,
  onSuccess,
  onFileRemoved
}: ContaEnergiaUploadProps) {
  const {
    isUploading,
    isDragging,
    showPdfPreview,
    pdfUrl,
    setIsDragging,
    setShowPdfPreview,
    handleFileUpload,
    handleDownload,
    handleRemoveFile,
    handlePreview,
  } = useFileUpload({ 
    pagamentoId, 
    onSuccess,
    onFileRemoved
  });

  const handleRemove = useCallback(() => {
    if (arquivoPath) {
      handleRemoveFile(arquivoPath, pagamentoId);
    }
  }, [arquivoPath, pagamentoId, handleRemoveFile]);

  const handleShowPreview = useCallback(() => {
    if (arquivoPath) {
      handlePreview(arquivoPath);
    }
  }, [arquivoPath, handlePreview]);

  const handleDownloadFile = useCallback(() => {
    if (arquivoPath && arquivoNome) {
      handleDownload(arquivoPath, arquivoNome);
    }
  }, [arquivoPath, arquivoNome, handleDownload]);

  return (
    <div className="space-y-4">
      {!arquivoNome && (
        <UploadDropZone
          isUploading={isUploading}
          isDragging={isDragging}
          onDrop={handleFileUpload}
          onDragStateChange={setIsDragging}
        />
      )}

      {arquivoNome && arquivoPath && (
        <FilePreview
          fileName={arquivoNome}
          onPreview={handleShowPreview}
          onDownload={handleDownloadFile}
          onRemove={handleRemove}
          className="bg-muted"
        />
      )}

      <PdfPreview
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        pdfUrl={pdfUrl}
      />
    </div>
  );
}

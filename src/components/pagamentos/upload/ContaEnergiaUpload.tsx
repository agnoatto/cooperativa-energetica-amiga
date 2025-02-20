
import { UploadDropZone } from "@/components/faturas/upload/UploadDropZone";
import { FilePreview } from "@/components/faturas/upload/FilePreview";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";
import { useFileUpload } from "./useFileUpload";

interface ContaEnergiaUploadProps {
  pagamentoId: string;
  arquivoNome?: string | null;
  arquivoPath?: string | null;
  onSuccess: () => void;
  onFileChange?: () => void;
}

export function ContaEnergiaUpload({
  pagamentoId,
  arquivoNome,
  arquivoPath,
  onSuccess,
  onFileChange
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
    onFileChange 
  });

  const onPreviewClick = () => {
    if (arquivoPath) {
      handlePreview(arquivoPath);
    }
  };

  const onDownloadClick = () => {
    if (arquivoPath && arquivoNome) {
      handleDownload(arquivoPath, arquivoNome);
    }
  };

  const onRemoveClick = () => {
    if (arquivoPath) {
      handleRemoveFile(arquivoPath, pagamentoId);
    }
  };

  return (
    <div className="space-y-4">
      {!arquivoNome && !arquivoPath && (
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
          onPreview={onPreviewClick}
          onDownload={onDownloadClick}
          onRemove={onRemoveClick}
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

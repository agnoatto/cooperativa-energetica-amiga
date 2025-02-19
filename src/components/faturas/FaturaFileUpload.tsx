
import { UploadDropZone } from "./upload/UploadDropZone";
import { FilePreview } from "./upload/FilePreview";
import { PdfPreview } from "./upload/PdfPreview";
import { useFileUpload } from "./upload/useFileUpload";

interface FaturaFileUploadProps {
  faturaId: string;
  arquivoNome?: string | null;
  arquivoPath?: string | null;
  onSuccess: () => void;
  onFileChange?: () => void;
}

export function FaturaFileUpload({ 
  faturaId, 
  arquivoNome, 
  arquivoPath,
  onSuccess,
  onFileChange
}: FaturaFileUploadProps) {
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
  } = useFileUpload(faturaId, onSuccess, onFileChange);

  return (
    <div className="space-y-4">
      {!arquivoNome && (
        <UploadDropZone
          isUploading={isUploading}
          isDragging={isDragging}
          onDrop={handleFileUpload}
        />
      )}

      {arquivoNome && arquivoPath && (
        <FilePreview
          fileName={arquivoNome}
          onPreview={() => handlePreview(arquivoPath)}
          onDownload={() => handleDownload(arquivoPath, arquivoNome)}
          onRemove={() => handleRemoveFile(arquivoPath, faturaId)}
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

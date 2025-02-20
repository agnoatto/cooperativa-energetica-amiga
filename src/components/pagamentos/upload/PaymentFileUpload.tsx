
import { UploadDropZone } from "@/components/faturas/upload/UploadDropZone";
import { FilePreview } from "@/components/faturas/upload/FilePreview";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";
import { useFileUpload } from "./useFileUpload";

interface PaymentFileUploadProps {
  pagamentoId: string;
  arquivoNome?: string | null;
  arquivoPath?: string | null;
  onSuccess: () => void;
  onFileChange?: () => void;
}

export function PaymentFileUpload({
  pagamentoId,
  arquivoNome,
  arquivoPath,
  onSuccess,
  onFileChange
}: PaymentFileUploadProps) {
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
  } = useFileUpload(pagamentoId, onSuccess, onFileChange);

  return (
    <div className="space-y-4">
      {!arquivoNome && (
        <UploadDropZone
          isUploading={isUploading}
          isDragging={isDragging}
          onDrop={handleFileUpload}
          setIsDragging={setIsDragging}
        />
      )}

      {arquivoNome && arquivoPath && (
        <FilePreview
          fileName={arquivoNome}
          onPreview={() => handlePreview(arquivoPath)}
          onDownload={() => handleDownload(arquivoPath, arquivoNome)}
          onRemove={() => handleRemoveFile(arquivoPath, pagamentoId)}
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

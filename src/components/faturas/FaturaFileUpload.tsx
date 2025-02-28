
import { UploadDropZone } from "./upload/UploadDropZone";
import { FilePreview } from "./upload/FilePreview";
import { PdfPreview } from "./upload/PdfPreview";
import { useFileUpload } from "./upload/useFileUpload";

interface FaturaFileUploadProps {
  faturaId: string;
  arquivoNome?: string | null;
  arquivoPath?: string | null;
  arquivoTipo?: string | null;
  arquivoTamanho?: number | null;
  onSuccess: () => void;
  onFileChange?: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
}

export function FaturaFileUpload({ 
  faturaId, 
  arquivoNome, 
  arquivoPath,
  arquivoTipo,
  arquivoTamanho,
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
          onDragStateChange={setIsDragging}
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

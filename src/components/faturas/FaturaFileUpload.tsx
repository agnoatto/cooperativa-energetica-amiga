
import { UploadDropZone } from "./upload/UploadDropZone";
import { FilePreview } from "./upload/FilePreview";
import { SimplePdfViewer } from "./upload/SimplePdfViewer";
import { useFileUpload } from "./upload/useFileUpload";

interface FaturaFileUploadProps {
  faturaId: string;
  arquivoNome?: string | null;
  arquivoPath?: string | null;
  arquivoTipo?: string | null;
  arquivoTamanho?: number | null;
  onSuccess: () => void;
  onFileChange?: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  refetchFaturas?: () => void; // Nova prop para refetch
}

export function FaturaFileUpload({ 
  faturaId, 
  arquivoNome, 
  arquivoPath,
  arquivoTipo,
  arquivoTamanho,
  onSuccess,
  onFileChange,
  refetchFaturas
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
  } = useFileUpload(faturaId, { 
    onSuccess, 
    onFileChange,
    refetchFaturas 
  });

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

      <SimplePdfViewer
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        pdfUrl={pdfUrl}
        title="Visualização da Fatura"
        allowDownload={true}
      />
    </div>
  );
}

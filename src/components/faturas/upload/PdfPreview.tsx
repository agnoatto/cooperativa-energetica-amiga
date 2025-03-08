
import { SimplePdfViewer } from "./SimplePdfViewer";

interface PdfPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
}

export function PdfPreview({ isOpen, onClose, pdfUrl }: PdfPreviewProps) {
  return (
    <SimplePdfViewer
      isOpen={isOpen}
      onClose={onClose}
      pdfUrl={pdfUrl}
      title="Visualização da Conta de Energia"
      allowDownload={true}
    />
  );
}

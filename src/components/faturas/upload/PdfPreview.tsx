
import { SimplePdfViewer } from "./SimplePdfViewer";

interface PdfPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title?: string;
}

export function PdfPreview({ isOpen, onClose, pdfUrl, title = "Visualização da Conta de Energia" }: PdfPreviewProps) {
  return (
    <SimplePdfViewer
      isOpen={isOpen}
      onClose={onClose}
      pdfUrl={pdfUrl}
      title={title}
      allowDownload={true}
    />
  );
}

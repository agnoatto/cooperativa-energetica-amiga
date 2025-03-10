
/**
 * Componente básico para visualização de PDF
 * 
 * Este componente recebe uma URL de PDF e o exibe em um iframe,
 * permitindo sua visualização direta na aplicação.
 */
import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configurar worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface SimplePdfViewerProps {
  pdfUrl: string;
}

export function SimplePdfViewer({ pdfUrl }: SimplePdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("[SimplePdfViewer] PDF carregado com sucesso. Páginas:", numPages);
    setNumPages(numPages);
    setIsLoading(false);
    setHasError(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("[SimplePdfViewer] Erro ao carregar PDF:", error);
    setIsLoading(false);
    setHasError(true);
    setErrorMessage(error.message || "Não foi possível carregar o documento");
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {errorMessage || "Não foi possível carregar o documento. Verifique se o arquivo existe."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<Loader2 className="h-8 w-8 animate-spin text-primary" />}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      
      {numPages && numPages > 1 && (
        <p className="mt-2 text-sm text-gray-500">
          Página {pageNumber} de {numPages}
        </p>
      )}
    </div>
  );
}

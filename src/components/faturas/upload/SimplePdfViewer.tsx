
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight, RefreshCw, ExternalLink } from "lucide-react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configurar worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface SimplePdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title?: string;
  allowDownload?: boolean;
  isInitialLoading?: boolean;
  error?: string | null;
}

export function SimplePdfViewer({ 
  isOpen, 
  onClose, 
  pdfUrl,
  title = "Visualização do Documento",
  allowDownload = false,
  isInitialLoading = false,
  error = null
}: SimplePdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(error !== null);
      setErrorMessage(error || "");
      setZoom(1.0);
      setRotation(0);
      setPageNumber(1);
      
      console.log("[SimplePdfViewer] Abrindo visualizador com URL:", pdfUrl);
      if (error) {
        console.log("[SimplePdfViewer] Com erro:", error);
      }
    }
  }, [isOpen, pdfUrl, error]);

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

  const handleRetry = () => {
    if (!pdfUrl) return;
    
    setIsLoading(true);
    setHasError(false);
    setRetryCount(prev => prev + 1);
    console.log("[SimplePdfViewer] Tentando carregar o PDF novamente:", pdfUrl);
  };

  const handleOpenExternal = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      // Abrir o PDF em uma nova aba, o que permite o download
      window.open(pdfUrl, '_blank');
    }
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
        <div className="p-4 border-b flex flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={zoomIn}
              className="h-8 w-8"
              title="Aumentar zoom"
              disabled={zoom >= 2.0 || isLoading || hasError}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={zoomOut}
              className="h-8 w-8"
              title="Diminuir zoom"
              disabled={zoom <= 0.5 || isLoading || hasError}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={rotate}
              className="h-8 w-8"
              title="Girar"
              disabled={isLoading || hasError}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            {allowDownload && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDownload}
                className="h-8 w-8"
                title="Baixar"
                disabled={!pdfUrl || isLoading || hasError}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleOpenExternal}
              className="h-8 w-8"
              title="Abrir em nova janela"
              disabled={!pdfUrl || isLoading || hasError}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 w-full h-[calc(100%-60px)] overflow-auto bg-gray-100 p-4">
          {(isLoading || isInitialLoading) && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Carregando documento...</span>
              </div>
            </div>
          )}
          
          {hasError && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Alert variant="destructive" className="max-w-md mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  {errorMessage || "Não foi possível carregar o documento. Verifique se o arquivo existe ou tente novamente mais tarde."}
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleRetry} 
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tentar novamente
                </Button>
                
                {pdfUrl && (
                  <Button 
                    variant="outline" 
                    onClick={handleOpenExternal} 
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir em nova janela
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {pdfUrl && !hasError && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                }
                error={
                  <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erro ao carregar o documento.
                    </AlertDescription>
                  </Alert>
                }
                key={`pdf-doc-${retryCount}`} // Força o recarregamento ao tentar novamente
              >
                <Page
                  pageNumber={pageNumber}
                  scale={zoom}
                  rotate={rotation}
                  className="shadow-lg bg-white"
                />
              </Document>
              
              {numPages && numPages > 1 && (
                <div className="flex items-center gap-4 mt-4 bg-white p-2 rounded shadow">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm">
                    Página {pageNumber} de {numPages}
                  </span>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={goToNextPage}
                    disabled={pageNumber >= numPages}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

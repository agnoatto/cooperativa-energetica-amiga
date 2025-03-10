
/**
 * Componente para visualização de arquivos PDF
 * 
 * Este componente permite a visualização de arquivos PDF em um modal
 * personalizado, com controles para fechar e navegar pelo documento.
 */
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimplePdfViewer } from "./SimplePdfViewer";

interface PdfPreviewProps {
  url: string | null;
  onClose: () => void;
  fileName?: string | null;
}

export function PdfPreview({ url, onClose, fileName }: PdfPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (url) {
      setIsOpen(true);
    }
  }, [url]);

  // Função para fechar a visualização sem propagar o evento
  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Impedir que o evento se propague
      e.preventDefault(); // Prevenir comportamento padrão
    }
    setIsOpen(false);
    onClose();
  };

  if (!url || !isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()} // Impedir que clicks se propaguem para componentes pais
    >
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium truncate">
            {fileName || "Visualização do documento"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <SimplePdfViewer url={url} />
        </div>
      </div>
    </div>
  );
}

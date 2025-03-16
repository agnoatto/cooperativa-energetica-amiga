
/**
 * Componente de ações para arquivos de conta de energia
 * 
 * Este componente provê o botão de visualização para arquivos de conta de energia.
 * Foi simplificado para mostrar apenas o botão de visualizar, conforme solicitado.
 */
import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";
import { STORAGE_BUCKET } from "../hooks/constants";
import { handlePreview } from "./utils/fileHandlers";

interface FileActionsProps {
  fileName: string | null;
  filePath: string | null;
  pagamentoId: string;
  onFileDeleted: () => void;
}

export function FileActions({ fileName, filePath, pagamentoId, onFileDeleted }: FileActionsProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  // Função para visualizar o arquivo
  const openPreview = async () => {
    if (!filePath) {
      toast.error("Não há arquivo para visualizar");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { url, error } = await handlePreview(filePath);
      
      if (error || !url) {
        throw error || new Error("Erro ao gerar visualização");
      }
      
      setPdfUrl(url);
      setShowPreview(true);
    } catch (error: any) {
      console.error('[FileActions] Erro ao visualizar arquivo:', error);
      toast.error(`Erro ao visualizar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Se não houver nome de arquivo ou caminho, apenas informa que não há arquivo
  if (!fileName || !filePath) {
    return <span className="text-xs text-gray-400">Não anexada</span>;
  }
  
  return (
    <>
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={openPreview}
          title="Visualizar conta"
          disabled={isLoading}
        >
          <FileText className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
      
      {/* Modal de visualização de PDF */}
      <PdfPreview 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        pdfUrl={pdfUrl}
        bucketName={STORAGE_BUCKET}
      />
    </>
  );
}

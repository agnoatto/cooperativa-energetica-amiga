
/**
 * Componente de ações para arquivos de conta de energia
 * 
 * Este componente provê botões de ação para visualizar, baixar e excluir
 * arquivos de conta de energia de forma consistente.
 */
import React, { useState } from "react";
import { FileText, FileDown, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PdfPreview } from "@/components/faturas/upload/PdfPreview";
import { STORAGE_BUCKET } from "../hooks/constants";
import { handleDownload, handleRemoveFile, handlePreview } from "./utils/fileHandlers";

interface FileActionsProps {
  fileName: string | null;
  filePath: string | null;
  pagamentoId: string;
  onFileDeleted: () => void;
}

export function FileActions({ fileName, filePath, pagamentoId, onFileDeleted }: FileActionsProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
  
  // Função para baixar o arquivo
  const downloadDocument = async () => {
    if (!filePath || !fileName) {
      toast.error("Não há arquivo para baixar");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await handleDownload(filePath, fileName);
    } catch (error: any) {
      console.error('[FileActions] Erro ao baixar arquivo:', error);
      toast.error(`Erro ao baixar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para excluir o arquivo
  const deleteDocument = async () => {
    if (!filePath) {
      toast.error("Não há arquivo para excluir");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await handleRemoveFile(filePath, pagamentoId);
      
      if (!success) {
        throw error || new Error("Erro ao excluir arquivo");
      }
      
      setShowDeleteConfirm(false);
      onFileDeleted();
    } catch (error: any) {
      console.error('[FileActions] Erro ao excluir arquivo:', error);
      toast.error(`Erro ao excluir: ${error.message}`);
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
      <div className="flex items-center justify-center space-x-1">
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

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={downloadDocument}
          title="Baixar conta"
          disabled={isLoading}
        >
          <FileDown className="h-4 w-4 text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setShowDeleteConfirm(true)}
          title="Excluir conta"
          disabled={isLoading}
        >
          <FileX className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      
      {/* Modal de visualização de PDF */}
      <PdfPreview 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        pdfUrl={pdfUrl}
        bucketName={STORAGE_BUCKET}
      />
      
      {/* Modal de confirmação de exclusão */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir arquivo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o arquivo "{fileName}"? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                deleteDocument();
              }}
              disabled={isLoading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

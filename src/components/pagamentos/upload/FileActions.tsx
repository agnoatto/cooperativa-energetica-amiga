
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
import { supabase } from "@/integrations/supabase/client";

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
  
  // Função para visualizar o arquivo
  const handlePreview = async () => {
    if (!filePath) {
      toast.error("Não há arquivo para visualizar");
      return;
    }
    
    setShowPreview(true);
  };
  
  // Função para baixar o arquivo
  const handleDownload = async () => {
    if (!filePath || !fileName) {
      toast.error("Não há arquivo para baixar");
      return;
    }
    
    const toastId = toast.loading("Preparando download...");
    
    try {
      // Obter URL pública e iniciar download
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);
      
      // Abrir em nova aba para download
      window.open(data.publicUrl, '_blank');
      toast.success("Download iniciado", { id: toastId });
    } catch (error: any) {
      console.error('[FileActions] Erro ao baixar arquivo:', error);
      toast.error(`Erro ao baixar: ${error.message}`, { id: toastId });
    }
  };
  
  // Função para excluir o arquivo
  const handleDelete = async () => {
    if (!filePath) {
      toast.error("Não há arquivo para excluir");
      return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading("Removendo arquivo...");
    
    try {
      // 1. Remover o arquivo do storage
      const { error: removeError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);
      
      if (removeError) {
        throw removeError;
      }
      
      // 2. Atualizar o registro no banco de dados
      const { error: updateError } = await supabase.rpc('atualizar_pagamento_usina', {
        p_id: pagamentoId,
        p_geracao_kwh: null,           // Mantemos os valores intactos
        p_tusd_fio_b: null,            // Passando null para manter os valores atuais
        p_valor_tusd_fio_b: null,
        p_valor_concessionaria: null,
        p_valor_total: null,
        p_data_vencimento_concessionaria: null,
        p_data_emissao: null,
        p_data_vencimento: null,
        p_arquivo_conta_energia_nome: null,    // Limpar arquivo
        p_arquivo_conta_energia_path: null,    // Limpar arquivo
        p_arquivo_conta_energia_tipo: null,    // Limpar arquivo
        p_arquivo_conta_energia_tamanho: null  // Limpar arquivo
      });
      
      if (updateError) {
        throw updateError;
      }
      
      toast.success("Arquivo removido com sucesso", { id: toastId });
      setShowDeleteConfirm(false);
      onFileDeleted();
    } catch (error: any) {
      console.error('[FileActions] Erro ao excluir arquivo:', error);
      toast.error(`Erro ao excluir: ${error.message}`, { id: toastId });
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
          onClick={handlePreview}
          title="Visualizar conta"
        >
          <FileText className="h-4 w-4 text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleDownload}
          title="Baixar conta"
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
        pdfUrl={filePath}
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
                handleDelete();
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

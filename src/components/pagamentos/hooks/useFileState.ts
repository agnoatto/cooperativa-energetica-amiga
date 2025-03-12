
/**
 * Hook para gerenciamento de arquivos em pagamentos
 * 
 * Este hook centraliza a lógica de estado e operações relacionadas a arquivos
 * de contas de energia nos pagamentos de usinas
 */

import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { removeFile as utilsRemoveFile, uploadFile as storageUploadFile } from "@/utils/storageUtils";

// Nome do bucket usado para armazenar os arquivos de contas de energia
export const STORAGE_BUCKET = 'contas-energia-usina';

export function useFileState() {
  const [fileInfo, setFileInfo] = useState<{
    nome: string | null;
    path: string | null;
    tipo: string | null;
    tamanho: number | null;
  }>({
    nome: null,
    path: null,
    tipo: null,
    tamanho: null
  });

  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, pagamentoId: string) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      console.log(`[useFileState] Iniciando upload do arquivo ${file.name} para o pagamento ${pagamentoId}`);
      console.log(`[useFileState] Usando bucket: ${STORAGE_BUCKET}`);
      
      // Criar um nome único para o arquivo usando o ID do pagamento
      const filePath = `${pagamentoId}/${Date.now()}_${file.name}`;
      
      // Usar a função utilitária para fazer o upload
      const result = await storageUploadFile(STORAGE_BUCKET, filePath, file);
      
      if (!result.success || result.error) {
        console.error("[useFileState] Erro no upload:", result.error);
        throw result.error;
      }
      
      console.log("[useFileState] Upload realizado com sucesso para o caminho:", filePath);
      
      // Atualizar o estado com as informações do arquivo
      // Importante: armazenamos apenas o caminho relativo, não a URL completa
      setFileInfo({
        nome: file.name,
        path: filePath,  // Armazenamos apenas o caminho relativo
        tipo: file.type,
        tamanho: file.size
      });
      
      toast.success("Arquivo enviado com sucesso");
      return filePath;  // Retornamos o caminho relativo
    } catch (error: any) {
      console.error("[useFileState] Erro ao fazer upload do arquivo:", error);
      toast.error(`Erro ao enviar arquivo: ${error.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = async () => {
    // Se não houver arquivo, não faz nada
    if (!fileInfo.path) {
      console.log("[useFileState] Nenhum arquivo para remover");
      return;
    }
    
    try {
      console.log("[useFileState] Removendo arquivo:", fileInfo.path);
      
      // Já temos o caminho correto, não precisamos extrair
      const filePath = fileInfo.path;
      
      console.log(`[useFileState] Usando bucket: ${STORAGE_BUCKET}`);
      
      // Chamar a função de utilidade para remover o arquivo
      const result = await utilsRemoveFile(STORAGE_BUCKET, filePath);
      
      if (!result.success) {
        console.warn("[useFileState] Aviso ao remover arquivo:", result.error);
        // Continuar mesmo com erro, para limpar o estado local
      } else {
        console.log("[useFileState] Arquivo removido com sucesso do storage");
      }
      
      // Limpar as informações do arquivo (independentemente do resultado da exclusão no storage)
      setFileInfo({
        nome: null,
        path: null,
        tipo: null,
        tamanho: null
      });
      
      console.log("[useFileState] Estado do arquivo após remoção:", {
        nome: null,
        path: null,
        tipo: null,
        tamanho: null
      });
      
    } catch (error: any) {
      console.error("[useFileState] Erro ao remover arquivo:", error);
      // Continuar e limpar o estado local mesmo se houver erro
      setFileInfo({
        nome: null,
        path: null,
        tipo: null,
        tamanho: null
      });
    }
  };

  const previewFile = () => {
    if (fileInfo.path) {
      console.log("[useFileState] Abrindo preview do arquivo:", fileInfo.path);
      
      // Gerar URL pública para visualização
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileInfo.path);
        
      const publicUrl = data.publicUrl;
      console.log("[useFileState] URL pública para preview:", publicUrl);
      window.open(publicUrl, '_blank');
    } else {
      console.log("[useFileState] Tentativa de abrir preview sem arquivo");
      toast.error("Não há arquivo para visualizar");
    }
  };

  return {
    fileInfo,
    setFileInfo,
    isUploading,
    uploadFile,
    removeFile,
    previewFile
  };
}

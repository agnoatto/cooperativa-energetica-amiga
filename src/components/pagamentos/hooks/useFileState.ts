
/**
 * Hook para gerenciamento de arquivos em pagamentos
 * 
 * Este hook centraliza a lógica de estado e operações relacionadas a arquivos
 * de contas de energia nos pagamentos de usinas
 */

import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Nome do bucket usado para armazenar os arquivos de contas de energia
const STORAGE_BUCKET = 'contas-energia-usina';

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
      
      // Fazer o upload do arquivo para o bucket de armazenamento
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error("[useFileState] Erro no upload:", error);
        throw error;
      }
      
      console.log("[useFileState] Upload concluído, obtendo URL pública");
      
      // Obter a URL pública do arquivo
      const { data: urlData } = await supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.path);
      
      if (!urlData?.publicUrl) {
        console.error("[useFileState] Não foi possível obter a URL pública");
        throw new Error("Não foi possível obter a URL pública do arquivo");
      }
      
      console.log("[useFileState] URL pública obtida:", urlData.publicUrl);
      
      // Atualizar o estado com as informações do arquivo
      setFileInfo({
        nome: file.name,
        path: urlData.publicUrl,
        tipo: file.type,
        tamanho: file.size
      });
      
      toast.success("Arquivo enviado com sucesso");
      return urlData.publicUrl;
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
    if (!fileInfo.path) return;
    
    try {
      console.log("[useFileState] Removendo arquivo:", fileInfo.path);
      
      // Extrair o caminho do arquivo da URL
      const url = new URL(fileInfo.path);
      const pathWithoutBucket = url.pathname.split('/').slice(2).join('/');
      
      console.log(`[useFileState] Caminho do arquivo no bucket: ${pathWithoutBucket}`);
      console.log(`[useFileState] Usando bucket: ${STORAGE_BUCKET}`);
      
      // Remover o arquivo do armazenamento
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([pathWithoutBucket]);
      
      if (error) {
        console.error("[useFileState] Erro ao remover arquivo:", error);
        throw error;
      }
      
      console.log("[useFileState] Arquivo removido com sucesso");
      
      // Limpar as informações do arquivo
      setFileInfo({
        nome: null,
        path: null,
        tipo: null,
        tamanho: null
      });
      
      toast.success("Arquivo removido com sucesso");
    } catch (error: any) {
      console.error("[useFileState] Erro ao remover arquivo:", error);
      toast.error(`Erro ao remover arquivo: ${error.message}`);
    }
  };

  const previewFile = () => {
    if (fileInfo.path) {
      console.log("[useFileState] Abrindo preview do arquivo:", fileInfo.path);
      window.open(fileInfo.path, '_blank');
    } else {
      console.log("[useFileState] Tentativa de abrir preview sem arquivo");
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

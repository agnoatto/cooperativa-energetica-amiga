
/**
 * Hook para gerenciamento de arquivos em pagamentos
 * 
 * Este hook centraliza a lógica de estado e operações relacionadas a arquivos
 * de contas de energia nos pagamentos de usinas
 */

import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      // Criar um nome único para o arquivo usando o ID do pagamento
      const filePath = `${pagamentoId}/${Date.now()}_${file.name}`;
      
      // Fazer o upload do arquivo para o bucket de armazenamento
      const { data, error } = await supabase.storage
        .from('contas-energia-usina')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Obter a URL pública do arquivo
      const { data: urlData } = await supabase.storage
        .from('contas-energia-usina')
        .getPublicUrl(data.path);
      
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
      // Extrair o caminho do arquivo da URL
      const url = new URL(fileInfo.path);
      const pathWithoutBucket = url.pathname.split('/').slice(2).join('/');
      
      // Remover o arquivo do armazenamento
      const { error } = await supabase.storage
        .from('contas-energia-usina')
        .remove([pathWithoutBucket]);
      
      if (error) {
        throw error;
      }
      
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
      window.open(fileInfo.path, '_blank');
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

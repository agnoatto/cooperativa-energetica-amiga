
/**
 * Hook para gerenciamento de arquivos em pagamentos
 * 
 * Este hook centraliza a lógica de estado e operações relacionadas a arquivos
 * de contas de energia nos pagamentos de usinas
 */

import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { removeFile, uploadFile as storageUploadFile } from "@/utils/storageUtils";

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
      const { success, error, publicUrl } = await storageUploadFile(STORAGE_BUCKET, filePath, file);
      
      if (!success || error) {
        console.error("[useFileState] Erro no upload:", error);
        throw error;
      }
      
      if (!publicUrl) {
        console.error("[useFileState] Não foi possível obter a URL pública");
        throw new Error("Não foi possível obter a URL pública do arquivo");
      }
      
      console.log("[useFileState] URL pública obtida:", publicUrl);
      
      // Atualizar o estado com as informações do arquivo
      setFileInfo({
        nome: file.name,
        path: publicUrl,
        tipo: file.type,
        tamanho: file.size
      });
      
      toast.success("Arquivo enviado com sucesso");
      return publicUrl;
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
      
      // Extrair o caminho do arquivo da URL
      const extractPath = (url: string): string | null => {
        try {
          // Procura por um padrão "/object/public/bucket-name/path" na URL
          const regex = /\/object\/public\/([^\/]+)\/(.+)/;
          const match = url.match(regex);
          
          if (match && match.length >= 3) {
            return match[2]; // O segundo grupo capturado é o caminho
          }
          
          return null;
        } catch (e) {
          console.error("[useFileState] Erro ao extrair caminho do arquivo:", e);
          return null;
        }
      };
      
      const filePath = extractPath(fileInfo.path);
      
      if (!filePath) {
        console.error("[useFileState] Não foi possível extrair o caminho do arquivo da URL");
        // Mesmo sem conseguir extrair o caminho, limparemos o estado
        setFileInfo({
          nome: null,
          path: null,
          tipo: null,
          tamanho: null
        });
        return;
      }
      
      console.log(`[useFileState] Caminho extraído para remoção: ${filePath}`);
      console.log(`[useFileState] Usando bucket: ${STORAGE_BUCKET}`);
      
      // Chamar a função de utilidade para remover o arquivo
      const { success, error } = await removeFile(STORAGE_BUCKET, filePath);
      
      if (!success) {
        console.warn("[useFileState] Aviso ao remover arquivo:", error);
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
      // Corrigir o URL duplicado que aparece nos logs
      const cleanUrl = fileInfo.path.replace(/https?:\/\/[^\/]+\/storage\/v1\/object\/public\/[^\/]+\//g, '');
      const correctUrl = `${supabase.supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${cleanUrl}`;
      console.log("[useFileState] URL limpo para preview:", correctUrl);
      window.open(correctUrl, '_blank');
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

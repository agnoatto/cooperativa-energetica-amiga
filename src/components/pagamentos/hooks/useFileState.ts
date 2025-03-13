
/**
 * Hook para gerenciamento de arquivos em pagamentos
 * 
 * Este hook centraliza a lógica de estado e operações relacionadas a arquivos
 * de contas de energia nos pagamentos de usinas
 */

import { useState } from 'react';
import { toast } from "sonner";
import { uploadFile as storageUploadFile } from "@/utils/storageUtils";

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

  return {
    fileInfo,
    setFileInfo,
    isUploading,
    uploadFile
  };
}

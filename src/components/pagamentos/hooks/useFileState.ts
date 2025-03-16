
/**
 * Hook para gerenciamento de arquivos em pagamentos
 * 
 * Este hook centraliza a lógica de estado e operações relacionadas a arquivos
 * de contas de energia nos pagamentos de usinas. Utiliza uma abordagem segura
 * para nomear arquivos no storage, evitando caracteres especiais.
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

  /**
   * Gera um nome de arquivo seguro para armazenamento
   * @param file Arquivo original
   * @param pagamentoId ID do pagamento relacionado
   * @returns Nome de arquivo seguro com extensão
   */
  const generateSafeFileName = (file: File, pagamentoId: string): string => {
    // Extrair a extensão do arquivo original, ou usar 'pdf' como padrão
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    
    // Gerar um UUID parcial usando crypto
    const randomId = crypto.randomUUID().substring(0, 8);
    
    // Combinar ID do pagamento, timestamp e ID aleatório para garantir unicidade
    return `${pagamentoId}/${Date.now()}_${randomId}.${fileExt}`;
  };

  const uploadFile = async (file: File, pagamentoId: string) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      console.log(`[useFileState] Iniciando upload do arquivo ${file.name} para o pagamento ${pagamentoId}`);
      console.log(`[useFileState] Usando bucket: ${STORAGE_BUCKET}`);
      
      // Gerar um nome de arquivo seguro
      const filePath = generateSafeFileName(file, pagamentoId);
      
      // Usar a função utilitária para fazer o upload
      const result = await storageUploadFile(STORAGE_BUCKET, filePath, file);
      
      if (!result.success || result.error) {
        console.error("[useFileState] Erro no upload:", result.error);
        throw result.error;
      }
      
      console.log("[useFileState] Upload realizado com sucesso para o caminho:", filePath);
      
      // Atualizar o estado com as informações do arquivo
      setFileInfo({
        nome: file.name, // Preservamos o nome original apenas para exibição ao usuário
        path: filePath,  // Usamos o caminho seguro para armazenamento
        tipo: file.type,
        tamanho: file.size
      });
      
      toast.success("Arquivo enviado com sucesso");
      return filePath;
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

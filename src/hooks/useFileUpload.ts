
/**
 * Hook para gerenciamento de upload e manipulação de arquivos
 * 
 * Este hook fornece funcionalidades para upload, visualização e remoção de arquivos,
 * abstraindo a lógica de manipulação do storage.
 */
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (
    file: File,
    folder: string,
    onProgress?: (progress: number) => void
  ) => {
    setIsUploading(true);
    try {
      // Gerar nome de arquivo único
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
      // Simular progresso para melhor UX
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
          onProgress?.(progress);
        }
      }, 300);

      // Upload do arquivo para o Supabase Storage
      const { error } = await supabase.storage
        .from("faturas_concessionaria")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      clearInterval(progressInterval);
      
      if (error) {
        throw error;
      }

      // Completar o progresso
      onProgress?.(100);
      
      return {
        path: filePath,
        nome: file.name,
        tipo: file.type,
        tamanho: file.size
      };
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error);
      toast.error(`Erro ao fazer upload: ${error.message}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (filePath: string) => {
    try {
      const { error } = await supabase.storage
        .from("faturas_concessionaria")
        .remove([filePath]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Erro ao excluir arquivo:", error);
      toast.error(`Erro ao excluir arquivo: ${error.message}`);
      throw error;
    }
  };

  const getFileUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("faturas_concessionaria")
        .createSignedUrl(filePath, 3600); // 1 hora de validade

      if (error) {
        throw error;
      }

      return data?.signedUrl;
    } catch (error: any) {
      console.error("Erro ao obter URL do arquivo:", error);
      toast.error(`Erro ao acessar arquivo: ${error.message}`);
      throw error;
    }
  };

  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    isUploading
  };
}

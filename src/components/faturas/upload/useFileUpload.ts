
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET } from "./constants";

export function useFileUpload(
  faturaId: string,
  onSuccess?: () => void,
  onFileChange?: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Função para lidar com upload de arquivo
  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split(".").pop();
    
    // Verificar tipo de arquivo
    if (fileExt !== "pdf") {
      toast.error("Apenas arquivos PDF são permitidos");
      return;
    }

    // Verificar tamanho do arquivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O tamanho máximo do arquivo é 5MB");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Enviando arquivo...");

    try {
      // Criar path único para o arquivo
      const filePath = `faturas/${faturaId}/${Date.now()}.${fileExt}`;

      // Upload para o storage
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Atualizar a fatura com informações do arquivo
      const { error: updateError } = await supabase
        .from("faturas")
        .update({
          arquivo_concessionaria_nome: file.name,
          arquivo_concessionaria_path: filePath,
          arquivo_concessionaria_tipo: file.type,
          arquivo_concessionaria_tamanho: file.size,
        })
        .eq("id", faturaId);

      if (updateError) {
        throw updateError;
      }

      // Notificar sucesso
      toast.success("Arquivo enviado com sucesso!", { id: toastId });
      
      // Chamar callback se disponível
      onSuccess?.();
      
      // Atualizar o estado do arquivo no componente pai
      if (onFileChange) {
        onFileChange(file.name, filePath, file.type, file.size);
      }
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error);
      toast.error(`Erro ao fazer upload: ${error.message}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  // Função para baixar arquivo
  const handleDownload = async (filePath: string, fileName: string) => {
    const toastId = toast.loading("Preparando download...");
    
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(filePath);

      if (error) {
        throw error;
      }

      // Criar URL para download e simular clique em link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Download iniciado", { id: toastId });
    } catch (error: any) {
      console.error("Erro ao baixar arquivo:", error);
      toast.error(`Erro ao baixar: ${error.message}`, { id: toastId });
    }
  };

  // Função para remover arquivo
  const handleRemoveFile = async (filePath: string, faturaId: string) => {
    const toastId = toast.loading("Removendo arquivo...");
    
    try {
      // Remover do storage
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

      if (storageError) {
        throw storageError;
      }

      // Atualizar a fatura removendo informações do arquivo
      const { error: updateError } = await supabase
        .from("faturas")
        .update({
          arquivo_concessionaria_nome: null,
          arquivo_concessionaria_path: null,
          arquivo_concessionaria_tipo: null,
          arquivo_concessionaria_tamanho: null,
        })
        .eq("id", faturaId);

      if (updateError) {
        throw updateError;
      }

      toast.success("Arquivo removido com sucesso", { id: toastId });
      
      // Chamar callback se disponível
      onSuccess?.();
      
      // Atualizar o estado do arquivo no componente pai
      if (onFileChange) {
        onFileChange(null, null, null, null);
      }
    } catch (error: any) {
      console.error("Erro ao remover arquivo:", error);
      toast.error(`Erro ao remover: ${error.message}`, { id: toastId });
    }
  };

  // Função para pré-visualizar PDF
  const handlePreview = async (filePath: string) => {
    const toastId = toast.loading("Carregando visualização...");
    
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(filePath, 3600); // URL válida por 1 hora

      if (error) {
        throw error;
      }

      setPdfUrl(data.signedUrl);
      setShowPdfPreview(true);
      toast.success("Documento carregado", { id: toastId });
    } catch (error: any) {
      console.error("Erro ao obter URL do PDF:", error);
      toast.error(`Erro ao carregar visualização: ${error.message}`, { id: toastId });
    }
  };

  return {
    isUploading,
    isDragging,
    showPdfPreview,
    pdfUrl,
    setIsDragging,
    setShowPdfPreview,
    handleFileUpload,
    handleDownload,
    handleRemoveFile,
    handlePreview,
  };
}

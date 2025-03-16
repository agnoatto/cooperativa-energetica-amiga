
/**
 * Componente para upload e visualização de arquivos de contas de energia
 * 
 * Este componente permite fazer upload, visualizar, baixar e remover arquivos
 * de contas de energia associados a um pagamento de usina.
 */

import { useCallback, useState } from "react";
import { UploadDropZone } from "@/components/faturas/upload/UploadDropZone";
import { FilePreview } from "@/components/faturas/upload/FilePreview";
import { toast } from "sonner";
import { useFileState } from "../hooks/useFileState";
import { handleRemoveFile } from "./utils/fileHandlers";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET } from "../hooks/constants";

interface ContaEnergiaUploadProps {
  pagamentoId: string;
  arquivoNome: string | null;
  arquivoPath: string | null;
  arquivoTipo: string | null;
  arquivoTamanho: number | null;
  onFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
}

export function ContaEnergiaUpload({
  pagamentoId,
  arquivoNome,
  arquivoPath,
  arquivoTipo,
  arquivoTamanho,
  onFileChange
}: ContaEnergiaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFile, isUploading } = useFileState();

  // Função para lidar com o upload de arquivos
  const handleUpload = useCallback(async (file: File) => {
    console.log("[ContaEnergiaUpload] Iniciando upload do arquivo:", file.name);
    
    try {
      // Agora recebemos o caminho relativo do arquivo, não a URL completa
      const filePath = await uploadFile(file, pagamentoId);
      if (filePath) {
        onFileChange(file.name, filePath, file.type, file.size);
        console.log("[ContaEnergiaUpload] Upload concluído com sucesso, caminho:", filePath);
      }
    } catch (error) {
      console.error("[ContaEnergiaUpload] Erro no upload:", error);
      toast.error("Erro ao fazer upload do arquivo");
    }
  }, [pagamentoId, uploadFile, onFileChange]);

  // Adaptamos a função handleDrop para receber um array de arquivos
  // mas continuamos a usar apenas o primeiro arquivo
  const handleDrop = useCallback((files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0]; // Pegamos apenas o primeiro arquivo
    console.log("[ContaEnergiaUpload] Arquivo recebido para upload:", file.name);
    
    // Verificar se o arquivo é um PDF
    if (file.type !== 'application/pdf') {
      toast.error("Apenas arquivos PDF são permitidos");
      return;
    }
    
    // Verificar o tamanho do arquivo (limite de 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      toast.error("O arquivo não pode ser maior que 10MB");
      return;
    }
    
    handleUpload(file);
  }, [handleUpload]);

  const handleDragStateChange = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!arquivoPath || !arquivoNome) {
      console.log("[ContaEnergiaUpload] Tentativa de download sem arquivo ou nome definido");
      return;
    }

    try {
      console.log("[ContaEnergiaUpload] Iniciando download do arquivo:", arquivoPath);
      
      // Gerar URL pública para download
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(arquivoPath);
        
      window.open(data.publicUrl, '_blank');
      toast.success("Download iniciado");
    } catch (error: any) {
      console.error('[ContaEnergiaUpload] Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  }, [arquivoPath, arquivoNome]);

  // Função de remoção atualizada para usar a função utilitária handleRemoveFile
  const handleRemove = useCallback(async () => {
    if (!arquivoPath || !pagamentoId) {
      console.log("[ContaEnergiaUpload] Tentativa de remoção sem caminho de arquivo ou ID do pagamento");
      return;
    }
    
    console.log("[ContaEnergiaUpload] Solicitando remoção do arquivo:", arquivoNome);
    
    try {
      const { success, error } = await handleRemoveFile(arquivoPath, pagamentoId);
      
      if (success) {
        onFileChange(null, null, null, null);
        toast.success("Arquivo removido com sucesso");
      } else {
        console.error("[ContaEnergiaUpload] Erro ao remover arquivo:", error);
        toast.error(`Erro ao remover arquivo: ${error?.message || "Erro desconhecido"}`);
      }
    } catch (error: any) {
      console.error("[ContaEnergiaUpload] Erro ao remover arquivo:", error);
      toast.error(`Erro ao remover arquivo: ${error.message}`);
    }
  }, [arquivoPath, arquivoNome, pagamentoId, onFileChange]);

  const handlePreview = useCallback(() => {
    if (!arquivoPath) {
      console.log("[ContaEnergiaUpload] Tentativa de visualizar sem arquivo definido");
      return;
    }
    
    console.log("[ContaEnergiaUpload] Visualizando arquivo:", arquivoPath);
    
    // Gerar URL pública para visualização
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(arquivoPath);
      
    window.open(data.publicUrl, '_blank');
  }, [arquivoPath]);

  return (
    <div className="space-y-4">
      {!arquivoNome && (
        <UploadDropZone
          isUploading={isUploading}
          isDragging={isDragging}
          onDrop={handleDrop}
          onDragStateChange={handleDragStateChange}
        />
      )}

      {arquivoNome && arquivoPath && (
        <FilePreview
          fileName={arquivoNome}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onRemove={handleRemove}
          className="bg-muted"
        />
      )}
    </div>
  );
}

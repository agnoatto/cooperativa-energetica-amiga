
import { useState } from "react";
import { toast } from "sonner";
import { FileUploadHookProps, FileUploadState } from "./types";
import { uploadFile, downloadFile, removeFile, getPreviewUrl } from "./fileHandlers";

export function useFileUpload({ pagamentoId, onSuccess, onFileChange }: FileUploadHookProps) {
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    isDragging: false,
    showPdfPreview: false,
    pdfUrl: null
  });

  const setIsUploading = (isUploading: boolean) => {
    setState(prev => ({ ...prev, isUploading }));
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    console.log('[Upload] Iniciando upload do arquivo:', file.name);

    try {
      const { filePath, file: uploadedFile } = await uploadFile(file, pagamentoId);

      const { data: { publicUrl } } = supabase.storage
        .from('pagamentos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('pagamentos_usina')
        .update({
          arquivo_comprovante_nome: uploadedFile.name,
          arquivo_comprovante_path: filePath,
          arquivo_comprovante_tipo: uploadedFile.type,
          arquivo_comprovante_tamanho: uploadedFile.size,
        })
        .eq('id', pagamentoId);

      if (updateError) {
        throw new Error(`Erro ao atualizar registro: ${updateError.message}`);
      }

      toast.success('Arquivo enviado com sucesso!');
      onSuccess();
      onFileChange?.();

    } catch (error: any) {
      console.error('[Upload] Erro no processo de upload:', error);
      toast.error(error.message || 'Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (arquivoPath: string, arquivoNome: string) => {
    setIsUploading(true);
    
    try {
      const { data, arquivoNome: fileName } = await downloadFile(arquivoPath, arquivoNome);
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
    } catch (error) {
      toast.error('Erro ao baixar arquivo. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async (arquivoPath: string, pagamentoId: string) => {
    setIsUploading(true);
    
    try {
      await removeFile(arquivoPath, pagamentoId);
      
      setState(prev => ({ ...prev, pdfUrl: null, showPdfPreview: false }));
      toast.success('Arquivo removido com sucesso!');
      onFileChange?.();
      onSuccess();
    } catch (error) {
      toast.error('Erro ao remover arquivo. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = async (arquivoPath: string) => {
    setIsUploading(true);
    
    try {
      const signedUrl = await getPreviewUrl(arquivoPath);
      if (signedUrl) {
        setState(prev => ({ 
          ...prev, 
          pdfUrl: signedUrl, 
          showPdfPreview: true 
        }));
      }
    } catch (error) {
      toast.error('Erro ao gerar preview do arquivo. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    ...state,
    setIsDragging: (isDragging: boolean) => setState(prev => ({ ...prev, isDragging })),
    setShowPdfPreview: (showPdfPreview: boolean) => setState(prev => ({ ...prev, showPdfPreview })),
    handleFileUpload,
    handleDownload,
    handleRemoveFile,
    handlePreview,
  };
}

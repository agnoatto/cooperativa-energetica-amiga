
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, FileText, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FaturaFileUploadProps {
  faturaId: string;
  arquivoNome?: string | null;
  arquivoPath?: string | null;
  onSuccess: () => void;
}

export function FaturaFileUpload({ 
  faturaId, 
  arquivoNome, 
  arquivoPath,
  onSuccess 
}: FaturaFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validar tipo do arquivo
    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecione um arquivo PDF');
      return;
    }

    // Validar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${faturaId}_${Date.now()}.${fileExt}`;
      const filePath = `${faturaId}/${fileName}`;

      // Se já existir um arquivo, remover
      if (arquivoPath) {
        await supabase.storage
          .from('faturas_concessionaria')
          .remove([arquivoPath]);
      }

      // Fazer upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('faturas_concessionaria')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Atualizar fatura com dados do novo arquivo
      const { error: updateError } = await supabase
        .from('faturas')
        .update({
          arquivo_concessionaria_nome: file.name,
          arquivo_concessionaria_path: filePath,
          arquivo_concessionaria_tipo: file.type,
          arquivo_concessionaria_tamanho: file.size
        })
        .eq('id', faturaId);

      if (updateError) throw updateError;

      toast.success('Arquivo enviado com sucesso!');
      onSuccess();

      // Obter URL do arquivo para visualização
      const { data: urlData } = await supabase.storage
        .from('faturas_concessionaria')
        .createSignedUrl(filePath, 60);

      if (urlData) {
        setPdfUrl(urlData.signedUrl);
        setShowPdfPreview(true);
      }
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async () => {
    if (!arquivoPath) return;

    try {
      setIsUploading(true);

      // Remover arquivo do storage
      const { error: removeError } = await supabase.storage
        .from('faturas_concessionaria')
        .remove([arquivoPath]);

      if (removeError) throw removeError;

      // Limpar dados do arquivo na fatura
      const { error: updateError } = await supabase
        .from('faturas')
        .update({
          arquivo_concessionaria_nome: null,
          arquivo_concessionaria_path: null,
          arquivo_concessionaria_tipo: null,
          arquivo_concessionaria_tamanho: null
        })
        .eq('id', faturaId);

      if (updateError) throw updateError;

      toast.success('Arquivo removido com sucesso!');
      onSuccess();
      setPdfUrl(null);
    } catch (error: any) {
      console.error('Erro ao remover arquivo:', error);
      toast.error('Erro ao remover arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!arquivoPath) return;

    try {
      const { data, error } = await supabase.storage
        .from('faturas_concessionaria')
        .download(arquivoPath);

      if (error) throw error;

      // Criar URL do blob e iniciar download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivoNome || 'conta-energia.pdf';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const handlePreview = async () => {
    if (!arquivoPath) return;

    try {
      const { data } = await supabase.storage
        .from('faturas_concessionaria')
        .createSignedUrl(arquivoPath, 60);

      if (data) {
        setPdfUrl(data.signedUrl);
        setShowPdfPreview(true);
      }
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
      toast.error('Erro ao gerar preview do arquivo');
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-gray-400"}`} />
          <div className="text-sm text-gray-600">
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando arquivo...
              </span>
            ) : (
              <>
                <span className="font-medium">Arraste e solte aqui</span> ou clique para selecionar
              </>
            )}
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            onClick={(e) => (e.currentTarget.value = '')}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
          >
            Selecionar arquivo
          </Button>
        </div>
      </div>

      {arquivoNome && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-sm truncate">{arquivoNome}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePreview}
            className="h-8 w-8"
            title="Visualizar arquivo"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="h-8 w-8"
            title="Baixar arquivo"
          >
            <FileUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemoveFile}
            className="h-8 w-8"
            title="Remover arquivo"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={showPdfPreview} onOpenChange={setShowPdfPreview}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Visualização da Conta de Energia</DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPdfPreview(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {pdfUrl && (
            <div className="flex-1 w-full h-full">
              <iframe
                src={`${pdfUrl}#toolbar=0`}
                className="w-full h-full rounded-md"
                title="Visualização da Conta de Energia"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

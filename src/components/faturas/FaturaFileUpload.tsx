
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

      // Fazer upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('faturas_concessionaria')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Se já existir um arquivo, remover
      if (arquivoPath) {
        await supabase.storage
          .from('faturas_concessionaria')
          .remove([arquivoPath]);
      }

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isUploading}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <FileUp className="h-4 w-4 mr-2" />
          )}
          {arquivoNome ? 'Substituir arquivo' : 'Enviar conta de energia'}
        </Button>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileUpload}
          onClick={(e) => (e.currentTarget.value = '')}
        />
      </div>

      {arquivoNome && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-sm truncate">{arquivoNome}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="h-8 w-8"
            title="Baixar arquivo"
          >
            <FileText className="h-4 w-4" />
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
    </div>
  );
}


import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleFileUpload = async (
  file: File,
  faturaId: string,
  onSuccess: () => void
) => {
  if (file.type !== 'application/pdf') {
    toast.error('Apenas arquivos PDF são permitidos');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('faturaId', faturaId);

  try {
    const { error } = await supabase.functions.invoke('upload-fatura', {
      body: formData,
    });

    if (error) throw error;

    toast.success('Arquivo enviado com sucesso!');
    onSuccess();
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error);
    toast.error('Erro ao enviar arquivo');
  }
};

export const downloadFile = async (
  filePath: string | null | undefined,
  fileName: string | null | undefined
) => {
  if (!filePath) return;

  try {
    const { data, error } = await supabase.storage
      .from('faturas_concessionaria')
      .download(filePath);

    if (error) throw error;

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'fatura.pdf';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Erro ao baixar arquivo:', error);
    toast.error('Erro ao baixar arquivo');
  }
};

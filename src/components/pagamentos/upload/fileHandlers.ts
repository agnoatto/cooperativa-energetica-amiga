
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export async function uploadFile(file: File, pagamentoId: string) {
  if (!file) {
    throw new Error('Nenhum arquivo selecionado');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Por favor, selecione um arquivo PDF');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('O arquivo deve ter no máximo 10MB');
  }

  const uuid = crypto.randomUUID();
  const fileExt = file.name.split('.').pop();
  const filePath = `comprovantes/${pagamentoId}/${uuid}_${Date.now()}.${fileExt}`;
  
  console.log('[Upload] Tentando fazer upload para:', filePath);
  
  const { error: uploadError } = await supabase.storage
    .from('pagamentos')
    .upload(filePath, file);

  if (uploadError) {
    console.error('[Upload] Erro no upload:', uploadError);
    throw new Error(`Erro no upload: ${uploadError.message}`);
  }

  return { filePath, file };
}

export async function downloadFile(arquivoPath: string, arquivoNome: string) {
  console.log('[Download] Tentando baixar arquivo:', arquivoPath);
  
  const { data, error } = await supabase.storage
    .from('pagamentos')
    .download(arquivoPath);

  if (error) {
    console.error('[Download] Erro ao baixar arquivo:', error);
    throw error;
  }

  return { data, arquivoNome };
}

export async function removeFile(arquivoPath: string, pagamentoId: string) {
  console.log('[Remover] Tentando remover arquivo:', arquivoPath);

  // Primeiro atualizar o registro no banco para evitar referências quebradas
  const { error: updateError } = await supabase
    .from('pagamentos_usina')
    .update({
      arquivo_conta_energia_nome: null,
      arquivo_conta_energia_path: null,
      arquivo_conta_energia_tipo: null,
      arquivo_conta_energia_tamanho: null
    })
    .eq('id', pagamentoId);

  if (updateError) {
    console.error('[Remover] Erro ao atualizar registro:', updateError);
    throw updateError;
  }

  // Depois remover o arquivo do storage
  const { error: removeError } = await supabase.storage
    .from('pagamentos')
    .remove([arquivoPath]);

  if (removeError) {
    console.error('[Remover] Erro ao remover arquivo do storage:', removeError);
    throw removeError;
  }
}

export async function getPreviewUrl(arquivoPath: string) {
  console.log('[Preview] Tentando gerar preview:', arquivoPath);
  
  const { data, error } = await supabase.storage
    .from('pagamentos')
    .createSignedUrl(arquivoPath, 300);

  if (error) {
    console.error('[Preview] Erro ao gerar URL assinada:', error);
    throw error;
  }

  return data?.signedUrl;
}

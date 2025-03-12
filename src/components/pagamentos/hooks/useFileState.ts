
/**
 * Hook para gerenciamento de arquivos em pagamentos
 * 
 * Este hook centraliza a lógica de estado e operações relacionadas a arquivos
 * de contas de energia nos pagamentos de usinas
 */

import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { removeFile as utilsRemoveFile, uploadFile as storageUploadFile } from "@/utils/storageUtils";

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
  const [isDeleting, setIsDeleting] = useState(false);

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

  const removeFile = async (pagamentoId?: string, filePath?: string) => {
    // Usamos o filePath passado como parâmetro ou o do estado
    const pathToRemove = filePath || fileInfo.path;
    
    // Se não houver arquivo, não faz nada
    if (!pathToRemove) {
      console.log("[useFileState] Nenhum arquivo para remover");
      return;
    }
    
    try {
      console.log("[useFileState] Removendo arquivo:", pathToRemove);
      
      // Chamar a função de utilidade para remover o arquivo
      const result = await utilsRemoveFile(STORAGE_BUCKET, pathToRemove);
      
      if (!result.success) {
        console.warn("[useFileState] Aviso ao remover arquivo:", result.error);
        // Continuar mesmo com erro, para limpar o estado local
      } else {
        console.log("[useFileState] Arquivo removido com sucesso do storage");
      }
      
      // Se foi passado um pagamentoId, podemos atualizar o registro no banco também
      if (pagamentoId) {
        console.log("[useFileState] Atualizando registro do pagamento no banco de dados:", pagamentoId);
        const { error: updateError } = await supabase.rpc('atualizar_pagamento_usina', {
          p_id: pagamentoId,
          p_geracao_kwh: null,           // Mantemos os valores intactos
          p_tusd_fio_b: null,            // Passando null para manter os valores atuais
          p_valor_tusd_fio_b: null,
          p_valor_concessionaria: null,
          p_valor_total: null,
          p_data_vencimento_concessionaria: null,
          p_data_emissao: null,
          p_data_vencimento: null,
          p_arquivo_conta_energia_nome: null,    // Limpar arquivo
          p_arquivo_conta_energia_path: null,    // Limpar arquivo
          p_arquivo_conta_energia_tipo: null,    // Limpar arquivo
          p_arquivo_conta_energia_tamanho: null  // Limpar arquivo
        });

        if (updateError) {
          console.error("[useFileState] Erro ao atualizar registro no banco:", updateError);
          throw new Error(`Erro ao atualizar registro no banco: ${updateError.message}`);
        }
      }
      
      // Limpar as informações do arquivo no estado local
      setFileInfo({
        nome: null,
        path: null,
        tipo: null,
        tamanho: null
      });
      
      console.log("[useFileState] Estado do arquivo após remoção:", {
        nome: null,
        path: null,
        tipo: null,
        tamanho: null
      });
      
      toast.success("Arquivo removido com sucesso");
      return true;
      
    } catch (error: any) {
      console.error("[useFileState] Erro ao remover arquivo:", error);
      toast.error(`Erro ao remover arquivo: ${error.message}`);
      
      // Limpar o estado local mesmo se houver erro com o storage
      setFileInfo({
        nome: null,
        path: null,
        tipo: null,
        tamanho: null
      });
      
      return false;
    }
  };

  const deleteFileFromPagamento = async (pagamentoId: string) => {
    try {
      setIsDeleting(true);
      console.log("[useFileState] Buscando informações do pagamento:", pagamentoId);
      
      // Primeiro, buscar o pagamento para obter o caminho do arquivo
      const { data: pagamento, error } = await supabase
        .from('pagamentos_usina')
        .select('arquivo_conta_energia_path')
        .eq('id', pagamentoId)
        .single();
      
      if (error) {
        console.error("[useFileState] Erro ao buscar pagamento:", error);
        throw error;
      }
      
      if (!pagamento?.arquivo_conta_energia_path) {
        console.log("[useFileState] Pagamento não possui arquivo para excluir");
        return;
      }
      
      // Chama o método de remoção passando o ID do pagamento e o caminho do arquivo
      return await removeFile(pagamentoId, pagamento.arquivo_conta_energia_path);
      
    } catch (error: any) {
      console.error("[useFileState] Erro ao excluir arquivo do pagamento:", error);
      toast.error(`Erro ao excluir arquivo: ${error.message}`);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Método para excluir contas de energia por IDs de pagamento
   * @param pagamentoIds Lista de IDs de pagamentos para remover os arquivos
   */
  const deleteMultipleFilesByPagamentoIds = async (pagamentoIds: string[]) => {
    if (!pagamentoIds.length) {
      toast.warning("Nenhum pagamento selecionado para excluir arquivos");
      return;
    }
    
    setIsDeleting(true);
    let sucessos = 0;
    let falhas = 0;
    
    try {
      console.log(`[useFileState] Excluindo arquivos de ${pagamentoIds.length} pagamentos`);
      
      // Primeiro buscar todos os pagamentos para obter os caminhos dos arquivos
      const { data: pagamentos, error } = await supabase
        .from('pagamentos_usina')
        .select('id, arquivo_conta_energia_path')
        .in('id', pagamentoIds)
        .filter('arquivo_conta_energia_path', 'not.is', null);
      
      if (error) {
        console.error("[useFileState] Erro ao buscar pagamentos:", error);
        throw error;
      }
      
      if (!pagamentos?.length) {
        console.log("[useFileState] Nenhum pagamento com arquivo encontrado");
        return { sucessos: 0, falhas: 0 };
      }
      
      console.log(`[useFileState] Encontrados ${pagamentos.length} pagamentos com arquivos`);
      
      // Para cada pagamento com arquivo, chamar a função de remoção
      for (const pagamento of pagamentos) {
        if (pagamento.arquivo_conta_energia_path) {
          try {
            const resultado = await removeFile(pagamento.id, pagamento.arquivo_conta_energia_path);
            if (resultado) {
              sucessos++;
            } else {
              falhas++;
            }
          } catch (error) {
            console.error(`[useFileState] Erro ao excluir arquivo do pagamento ${pagamento.id}:`, error);
            falhas++;
          }
        }
      }
      
      if (sucessos > 0) {
        toast.success(`${sucessos} arquivo${sucessos > 1 ? 's' : ''} removido${sucessos > 1 ? 's' : ''} com sucesso`);
      }
      
      if (falhas > 0) {
        toast.error(`Falha ao remover ${falhas} arquivo${falhas > 1 ? 's' : ''}`);
      }
      
      return { sucessos, falhas };
    } catch (error: any) {
      console.error("[useFileState] Erro ao excluir múltiplos arquivos:", error);
      toast.error(`Erro ao excluir arquivos: ${error.message}`);
      return { sucessos, falhas };
    } finally {
      setIsDeleting(false);
    }
  };

  const previewFile = () => {
    if (fileInfo.path) {
      console.log("[useFileState] Abrindo preview do arquivo:", fileInfo.path);
      
      // Gerar URL pública para visualização
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileInfo.path);
        
      const publicUrl = data.publicUrl;
      console.log("[useFileState] URL pública para preview:", publicUrl);
      window.open(publicUrl, '_blank');
    } else {
      console.log("[useFileState] Tentativa de abrir preview sem arquivo");
      toast.error("Não há arquivo para visualizar");
    }
  };

  return {
    fileInfo,
    setFileInfo,
    isUploading,
    isDeleting,
    uploadFile,
    removeFile,
    deleteFileFromPagamento,
    deleteMultipleFilesByPagamentoIds,
    previewFile
  };
}

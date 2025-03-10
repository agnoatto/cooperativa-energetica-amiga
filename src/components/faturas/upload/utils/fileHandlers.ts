
/**
 * Funções para manipulação de arquivos relacionados às faturas
 * 
 * Este módulo contém funções para upload, download e visualização
 * de arquivos relacionados às faturas.
 */
import { toast } from "sonner";
import { validateFile } from "./fileValidation";
import { 
  uploadFileToStorage, 
  updateFaturaFileMetadata,
  getFileFromStorage,
  removeFileFromStorage
} from "./storageUtils";

export async function handleFileUpload(
  file: File, 
  faturaId: string,
  onFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void,
  onStatusChange?: (newStatus: string) => void
) {
  if (!file) {
    toast.error("Nenhum arquivo selecionado");
    return;
  }

  // Validar o arquivo
  const validationError = validateFile(file);
  if (validationError) {
    toast.error(validationError);
    return;
  }

  // Mostrar toast de loading
  toast.loading("Enviando arquivo...");

  try {
    // Gerar nome do arquivo no storage (id-fatura_nome-original)
    const fileName = `${faturaId}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = `faturas/${fileName}`;

    // Fazer upload para o storage
    const uploadResult = await uploadFileToStorage(filePath, file);
    if (!uploadResult.success) {
      throw new Error(uploadResult.error || "Erro ao fazer upload do arquivo");
    }

    // Atualizar metadados na tabela faturas
    const updateResult = await updateFaturaFileMetadata(faturaId, {
      nome: file.name,
      path: filePath,
      tipo: file.type,
      tamanho: file.size
    });

    if (!updateResult.success) {
      // Se falhar a atualização no banco, remove o arquivo do storage
      await removeFileFromStorage(filePath);
      throw new Error(updateResult.error || "Erro ao atualizar informações do arquivo");
    }

    // Atualizar estado local
    onFileChange(file.name, filePath, file.type, file.size);
    
    // Se a função de mudança de status foi fornecida, sugerir atualização
    if (onStatusChange) {
      onStatusChange('gerada');
    }

    toast.dismiss();
    toast.success("Arquivo enviado com sucesso!");
  } catch (error: any) {
    toast.dismiss();
    toast.error(`Erro ao enviar arquivo: ${error.message}`);
    console.error("Erro no upload de arquivo:", error);
  }
}

export async function handleFileRemove(
  filePath: string | null,
  faturaId: string,
  onFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void
) {
  if (!filePath) {
    return;
  }

  toast.loading("Removendo arquivo...");

  try {
    // Remover do storage
    const removeResult = await removeFileFromStorage(filePath);
    if (!removeResult.success) {
      throw new Error(removeResult.error || "Erro ao remover arquivo");
    }

    // Atualizar metadados na tabela faturas (limpar)
    const updateResult = await updateFaturaFileMetadata(faturaId, {
      nome: null,
      path: null,
      tipo: null,
      tamanho: null
    });

    if (!updateResult.success) {
      throw new Error(updateResult.error || "Erro ao atualizar informações do arquivo");
    }

    // Atualizar estado local
    onFileChange(null, null, null, null);

    toast.dismiss();
    toast.success("Arquivo removido com sucesso!");
  } catch (error: any) {
    toast.dismiss();
    toast.error(`Erro ao remover arquivo: ${error.message}`);
    console.error("Erro na remoção de arquivo:", error);
  }
}

// Esta função apenas retorna a URL do arquivo sem fechar o formulário
export async function getFilePreviewUrl(filePath: string | null) {
  if (!filePath) {
    toast.error("Nenhum arquivo para visualizar");
    return null;
  }

  try {
    const result = await getFileFromStorage(filePath);
    
    if (!result.success || !result.url) {
      throw new Error(result.error || "Erro ao obter URL do arquivo");
    }
    
    return result.url;
  } catch (error: any) {
    toast.error(`Erro ao gerar URL para visualização: ${error.message}`);
    console.error("Erro ao gerar URL de visualização:", error);
    return null;
  }
}

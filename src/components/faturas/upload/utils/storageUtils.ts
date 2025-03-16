/**
 * Utilitários para operações de armazenamento
 * Este módulo contém funções para upload, download e gerenciamento
 * de arquivos no storage do Supabase
 */

import { 
  uploadFile as sharedUploadFile, 
  getSignedUrl as sharedGetSignedUrl,
  downloadFile as sharedDownloadFile,
  removeFile as sharedRemoveFile
} from "@/utils/storage";

// Fazer upload de arquivo para o storage
export const uploadFile = async (
  bucketName: string, 
  filePath: string, 
  file: File
): Promise<{ success: boolean; error?: any }> => {
  console.log(`[storageUtils:faturas] Enviando arquivo para: ${filePath} no bucket: ${bucketName}`);
  return sharedUploadFile(bucketName, filePath, file);
};

// Criar URL assinada para visualização
export const getSignedUrl = async (
  bucketName: string, 
  filePath: string, 
  expiresIn: number = 3600
): Promise<{ url: string | null; error?: any }> => {
  console.log(`[storageUtils:faturas] Gerando URL assinada para: ${filePath} no bucket: ${bucketName}`);
  return sharedGetSignedUrl(bucketName, filePath, expiresIn);
};

// Baixar arquivo
export const downloadFile = async (
  bucketName: string, 
  filePath: string
): Promise<{ data: Blob | null; error?: any }> => {
  console.log(`[storageUtils:faturas] Baixando arquivo: ${filePath} do bucket: ${bucketName}`);
  return sharedDownloadFile(bucketName, filePath);
};

// Remover arquivo
export const removeFile = async (
  bucketName: string, 
  filePath: string
): Promise<{ success: boolean; error?: any }> => {
  console.log(`[storageUtils:faturas] Removendo arquivo: ${filePath} do bucket: ${bucketName}`);
  return sharedRemoveFile(bucketName, filePath);
};


/**
 * Utilitários compartilhados para operações de armazenamento
 * 
 * Este módulo centraliza funções de armazenamento comuns para upload, download,
 * remoção e geração de URLs assinadas para arquivos em diversos módulos do sistema
 * 
 * AVISO: Este arquivo foi refatorado e agora importa do módulo src/utils/storage
 */

// Re-exportar todas as funções do novo módulo de storage
export {
  uploadFile,
  downloadFile,
  getSignedUrl,
  removeFile,
  checkFileExists
} from './storage';

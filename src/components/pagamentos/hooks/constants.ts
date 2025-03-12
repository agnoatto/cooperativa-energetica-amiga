
/**
 * Constantes utilizadas nos componentes de pagamentos
 * 
 * Centraliza valores constantes usados em componentes e funções
 * do módulo de pagamentos.
 */

// Nome do bucket para armazenar arquivos de contas de energia
export const STORAGE_BUCKET = 'contas-energia-usina';

// Tempo de expiração para URLs assinadas em segundos (1 hora)
export const SIGNED_URL_EXPIRY = 3600;

// Tipo de arquivo permitido para upload
export const FILE_TYPE = 'application/pdf';

// Tamanho máximo de arquivo em bytes (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Padrão para validação e limpeza de nomes de arquivos
export const VALID_FILE_CHARS = /[^a-zA-Z0-9\-_.]/g;

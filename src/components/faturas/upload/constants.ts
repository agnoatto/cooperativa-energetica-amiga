
// Este arquivo define constantes para operações de upload e visualização de arquivos
// relacionados às faturas de concessionárias

export const SIGNED_URL_EXPIRY = 3600; // 1 hora
export const STORAGE_BUCKET = 'faturas_concessionaria'; // Bucket para armazenamento de faturas (corrigido)
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const FILE_TYPE = 'application/pdf';
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 segundo
export const VALID_FILE_CHARS = /[^a-zA-Z0-9\-_.]/g;


// Este arquivo define constantes para operações de upload e visualização de arquivos
// relacionados aos pagamentos de usinas

export const SIGNED_URL_EXPIRY = 3600; // 1 hora
export const STORAGE_BUCKET = 'contas-energia-usina'; // Bucket para contas de energia na área de pagamentos
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const FILE_TYPE = 'application/pdf';
export const VALID_FILE_CHARS = /[^a-zA-Z0-9\-_.]/g;

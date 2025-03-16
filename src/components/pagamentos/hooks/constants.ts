
/**
 * Constantes utilizadas nos hooks de pagamentos
 * 
 * Este arquivo centraliza valores constantes para uso em diversos
 * componentes de pagamentos de usinas.
 */

// Tipo de arquivo permitido para upload
export const FILE_TYPE = 'application/pdf';

// Tamanho máximo de arquivo (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Expressão regular para remover caracteres inválidos de nomes de arquivos
export const VALID_FILE_CHARS = /[^a-zA-Z0-9.-]/g;


/**
 * Utilitários para logging de operações de storage
 * 
 * Este módulo contém funções para padronizar os logs de operações no storage
 */

type LogLevel = 'info' | 'error' | 'warn';
type OperationType = 'upload' | 'download' | 'url' | 'remove' | 'check';

/**
 * Cria um log padronizado para operações de storage
 * @param operation Tipo de operação sendo realizada
 * @param message Mensagem a ser logada
 * @param level Nível do log (info, error, warn)
 */
export const logStorage = (
  operation: OperationType, 
  message: string,
  level: LogLevel = 'info'
): void => {
  const prefix = '[storageUtils]';
  const fullMessage = `${prefix} ${message}`;
  
  switch (level) {
    case 'error':
      console.error(fullMessage);
      break;
    case 'warn':
      console.warn(fullMessage);
      break;
    default:
      console.log(fullMessage);
  }
};

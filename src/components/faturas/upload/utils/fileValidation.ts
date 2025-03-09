
/**
 * Arquivo de validação para operações relacionadas a arquivos de faturas
 * Este módulo é responsável por validar tipos, tamanhos e formatos de arquivos
 * antes do upload ou outras operações
 */

import { toast } from "sonner";

// Validar tipo e tamanho do arquivo
export const validateFile = (file: File, maxSize: number = 5 * 1024 * 1024, allowedTypes: string[] = ['pdf']): boolean => {
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  
  // Verificar tipo de arquivo
  if (!fileExt || !allowedTypes.includes(fileExt)) {
    toast.error(`Apenas arquivos ${allowedTypes.join(', ')} são permitidos`);
    return false;
  }

  // Verificar tamanho do arquivo
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    toast.error(`O tamanho máximo do arquivo é ${maxSizeMB}MB`);
    return false;
  }

  return true;
};

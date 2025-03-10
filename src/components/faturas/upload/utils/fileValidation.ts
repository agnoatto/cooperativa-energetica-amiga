
/**
 * Arquivo de validação para operações relacionadas a arquivos de faturas
 * Este módulo é responsável por validar tipos, tamanhos e formatos de arquivos
 * antes do upload ou outras operações
 */

// Validar tipo e tamanho do arquivo
export const validateFile = (file: File): string | null => {
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const allowedTypes = ['pdf'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  // Verificar tipo de arquivo
  if (!fileExt || !allowedTypes.includes(fileExt)) {
    return `Apenas arquivos ${allowedTypes.join(', ')} são permitidos`;
  }

  // Verificar tamanho do arquivo
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `O tamanho máximo do arquivo é ${maxSizeMB}MB`;
  }

  return null;
};

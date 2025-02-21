
import { FILE_TYPE, MAX_FILE_SIZE, VALID_FILE_CHARS } from "../constants";

export function sanitizeFileName(fileName: string): string {
  // Remove caracteres especiais e espaços do nome do arquivo
  const nameWithoutExt = fileName.split('.')[0];
  const ext = fileName.split('.').pop();
  
  const sanitizedName = nameWithoutExt
    .replace(/:/g, '-')  // Substitui : por -
    .replace(VALID_FILE_CHARS, '') // Remove outros caracteres especiais
    .trim();

  return `${sanitizedName}.${ext}`;
}

export function validateFile(file: File): string | null {
  const sanitizedName = sanitizeFileName(file.name);
  console.log('[validateFile] Nome original:', file.name, 'Nome sanitizado:', sanitizedName);

  if (file.type !== FILE_TYPE) {
    return 'Por favor, selecione um arquivo PDF';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'O arquivo deve ter no máximo 10MB';
  }

  return null;
}

export function generateFilePath(pagamentoId: string, fileName: string): string {
  const sanitizedName = sanitizeFileName(fileName);
  const fileExt = sanitizedName.split('.').pop();
  const timestamp = Date.now();
  const newFileName = `${pagamentoId}_${timestamp}.${fileExt}`;
  
  console.log('[generateFilePath] Gerando caminho:', {
    pagamentoId,
    originalName: fileName,
    sanitizedName,
    newFileName,
    finalPath: `${pagamentoId}/${newFileName}`
  });

  return `${pagamentoId}/${newFileName}`;
}

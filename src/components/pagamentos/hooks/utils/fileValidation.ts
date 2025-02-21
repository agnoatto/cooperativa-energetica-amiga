
import { FILE_TYPE, MAX_FILE_SIZE } from "../constants";

export function validateFile(file: File): string | null {
  if (file.type !== FILE_TYPE) {
    return 'Por favor, selecione um arquivo PDF';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'O arquivo deve ter no máximo 10MB';
  }

  return null;
}

export function generateFilePath(pagamentoId: string, fileName: string): string {
  const fileExt = fileName.split('.').pop();
  const newFileName = `${pagamentoId}_${Date.now()}.${fileExt}`;
  return `${pagamentoId}/${newFileName}`;
}

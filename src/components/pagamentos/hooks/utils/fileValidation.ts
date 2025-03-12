
/**
 * Funções de validação para arquivos de contas de energia
 * 
 * Este arquivo contém funções para validar tipos, tamanhos e formatos
 * de arquivos antes do upload ou outras operações
 */

import { toast } from "sonner";
import { FILE_TYPE, MAX_FILE_SIZE, VALID_FILE_CHARS } from "../constants";

// Validar arquivo antes do upload
export const validateFile = (file: File): boolean => {
  // Verificar tipo
  if (file.type !== FILE_TYPE) {
    toast.error("Apenas arquivos PDF são permitidos");
    return false;
  }
  
  // Verificar tamanho
  if (file.size > MAX_FILE_SIZE) {
    toast.error("O arquivo não pode ser maior que 10MB");
    return false;
  }
  
  // Verificar nome do arquivo
  const fileName = file.name.replace(VALID_FILE_CHARS, '');
  if (fileName !== file.name) {
    console.warn("[fileValidation] Nome do arquivo contém caracteres inválidos que serão removidos");
  }
  
  return true;
};

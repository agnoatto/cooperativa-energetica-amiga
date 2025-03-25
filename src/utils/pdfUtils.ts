
import { jsPDF } from "jspdf";
import { FileText, DollarSign, TrendingUp } from "lucide-react";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const addDivider = (doc: jsPDF, y: number) => {
  doc.setDrawColor(230, 230, 230);
  doc.line(20, y, 190, y);
};

/**
 * Estima o número máximo de caracteres que cabem em uma área específica do PDF
 * Útil para garantir que textos como observações não façam o documento ter múltiplas páginas
 * 
 * @param width Largura disponível em mm
 * @param height Altura disponível em mm
 * @param fontSize Tamanho da fonte em pt
 * @returns Estimativa de caracteres que cabem no espaço
 */
export const estimateMaxChars = (width: number, height: number, fontSize: number): number => {
  // Valores aproximados baseados em testes
  const charsPerLine = Math.floor(width / (fontSize * 0.4));
  const lines = Math.floor(height / (fontSize * 1.2));
  
  return charsPerLine * lines;
};

/**
 * Trunca um texto para garantir que ele caiba em uma área específica
 * 
 * @param text Texto a ser truncado
 * @param maxChars Número máximo de caracteres
 * @returns Texto truncado com reticências se necessário
 */
export const truncateForPdf = (text: string | null, maxChars: number = 500): string => {
  if (!text) return '';
  
  if (text.length <= maxChars) {
    return text;
  }
  
  return `${text.substring(0, maxChars)}...`;
};

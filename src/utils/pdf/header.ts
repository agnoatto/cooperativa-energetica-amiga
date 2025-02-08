
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";

interface HeaderConfig {
  title: string;
  logoPath: string;
}

export const addHeader = (doc: jsPDF, config: HeaderConfig): number => {
  try {
    // Fundo azul escuro
    doc.setFillColor(COLORS.DARK_BLUE[0], COLORS.DARK_BLUE[1], COLORS.DARK_BLUE[2]);
    doc.rect(0, 0, 210, SPACING.TOP, 'F');

    // Título
    doc.setTextColor(COLORS.WHITE[0], COLORS.WHITE[1], COLORS.WHITE[2]);
    doc.setFontSize(FONTS.TITLE);
    doc.text(config.title, SPACING.MARGIN, SPACING.TOP/2 + 5);

    return SPACING.TOP + 10;
  } catch (error) {
    console.error('Erro ao adicionar cabeçalho:', error);
    throw new Error('Falha ao adicionar cabeçalho do PDF');
  }
};

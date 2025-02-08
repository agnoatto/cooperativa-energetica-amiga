
import { jsPDF } from "jspdf";
import { COLORS, FONTS } from "./constants";

interface HeaderConfig {
  title: string;
  logoPath: string;
}

export const addHeader = (doc: jsPDF, config: HeaderConfig): number => {
  // Fundo azul escuro
  doc.setFillColor(COLORS.DARK_BLUE[0], COLORS.DARK_BLUE[1], COLORS.DARK_BLUE[2]);
  doc.rect(0, 0, 210, 30, 'F');

  // Título
  doc.setTextColor(COLORS.WHITE[0], COLORS.WHITE[1], COLORS.WHITE[2]);
  doc.setFontSize(FONTS.TITLE);
  doc.text(config.title, 20, 20);

  // Logo será adicionada à direita
  return 40;
};

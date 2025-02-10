
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";

interface HeaderConfig {
  title: string;
  logoPath: string;
}

export const addHeader = async (doc: jsPDF, config: HeaderConfig): Promise<number> => {
  // Background header
  doc.setFillColor(COLORS.DARK_BLUE[0], COLORS.DARK_BLUE[1], COLORS.DARK_BLUE[2]);
  doc.rect(0, 0, SPACING.PAGE.WIDTH, SPACING.TOP, 'F');

  // Logo
  try {
    const logo = await loadLogo(config.logoPath);
    const logoWidth = 35;
    const logoHeight = 18;
    doc.addImage(
      logo, 
      'PNG', 
      SPACING.MARGIN, // Changed from right to left position
      (SPACING.TOP - logoHeight) / 2,
      logoWidth,
      logoHeight
    );
  } catch (error) {
    console.error('Erro ao carregar logo:', error);
  }

  // Title (moved to the right of the logo)
  doc.setTextColor(COLORS.WHITE[0], COLORS.WHITE[1], COLORS.WHITE[2]);
  doc.setFontSize(FONTS.TITLE);
  doc.text(config.title, SPACING.MARGIN + 40, SPACING.TOP/2 + 5); // Added offset to not overlap with logo

  return SPACING.TOP + 10;
};

const loadLogo = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};



import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";

interface HeaderConfig {
  title: string;
  logoPath: string;
  status: string;
}

export const addHeader = async (doc: jsPDF, config: HeaderConfig): Promise<number> => {
  // Background header
  doc.setFillColor(COLORS.DARK_BLUE[0], COLORS.DARK_BLUE[1], COLORS.DARK_BLUE[2]);
  doc.rect(0, 0, SPACING.PAGE.WIDTH, SPACING.TOP, 'F');

  // Title
  doc.setTextColor(COLORS.WHITE[0], COLORS.WHITE[1], COLORS.WHITE[2]);
  doc.setFontSize(FONTS.TITLE);
  doc.text(config.title, SPACING.MARGIN, SPACING.TOP/2 + 8);

  // Status box
  const statusBoxWidth = 60;
  const statusBoxHeight = 20;
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(
    SPACING.PAGE.WIDTH - SPACING.MARGIN - statusBoxWidth,
    (SPACING.TOP - statusBoxHeight) / 2,
    statusBoxWidth,
    statusBoxHeight,
    3,
    3,
    'F'
  );
  
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);
  doc.text(
    `Status: ${config.status}`,
    SPACING.PAGE.WIDTH - SPACING.MARGIN - statusBoxWidth + 5,
    (SPACING.TOP - statusBoxHeight) / 2 + 13
  );

  // Logo
  try {
    const logo = await loadLogo(config.logoPath);
    const logoWidth = 40;
    const logoHeight = 20;
    doc.addImage(
      logo, 
      'PNG', 
      SPACING.PAGE.WIDTH - SPACING.MARGIN - logoWidth - statusBoxWidth - 10,
      (SPACING.TOP - logoHeight) / 2,
      logoWidth,
      logoHeight
    );
  } catch (error) {
    console.error('Erro ao carregar logo:', error);
  }

  return SPACING.TOP + 15;
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

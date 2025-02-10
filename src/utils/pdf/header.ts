
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

  // Title (moved to center when no logo)
  doc.setTextColor(COLORS.WHITE[0], COLORS.WHITE[1], COLORS.WHITE[2]);
  doc.setFontSize(FONTS.TITLE);
  
  // If there's a logo path, try to load it
  if (config.logoPath) {
    try {
      const logo = await loadLogo(config.logoPath);
      const logoWidth = 35;
      const logoHeight = 18;
      doc.addImage(
        logo, 
        'PNG', 
        SPACING.MARGIN,
        (SPACING.TOP - logoHeight) / 2,
        logoWidth,
        logoHeight
      );
      // Title with logo
      doc.text(config.title, SPACING.MARGIN + 40, SPACING.TOP/2 + 5);
    } catch (error) {
      console.warn('Erro ao carregar logo:', error);
      // Title centered when no logo
      doc.text(config.title, SPACING.PAGE.WIDTH / 2, SPACING.TOP/2 + 5, { align: 'center' });
    }
  } else {
    // Title centered when no logo specified
    doc.text(config.title, SPACING.PAGE.WIDTH / 2, SPACING.TOP/2 + 5, { align: 'center' });
  }

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
        reject(new Error('Falha ao obter contexto do canvas'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      console.warn('Falha ao carregar imagem do logo');
      reject(new Error('Falha ao carregar imagem'));
    };
    img.src = url;
  });
};


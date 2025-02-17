
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BoletimData } from "@/components/pagamentos/types/boletim";
import { COLORS, FONTS, SPACING } from "./pdf/constants";
import { addHeader } from "./pdf/pdfHeader";
import { addUsinaInfo, addDataTable } from "./pdf/boletimSections";

export const generateBoletimPdf = async (data: BoletimData): Promise<{ doc: jsPDF, fileName: string }> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let yPos = 0;

  doc.setFontSize(FONTS.TITLE);
  doc.text("Cooperativa Cogesol", SPACING.PAGE.WIDTH/2, 20, { align: "center" });
  doc.setFontSize(FONTS.NORMAL);
  doc.text("CNPJ: 57.658.963/0001-02", SPACING.PAGE.WIDTH/2, 30, { align: "center" });
  
  doc.setFillColor(240, 249, 255);
  doc.rect(SPACING.PAGE.WIDTH - 80, 40, 60, 25, 'F');
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Mês de Referência", SPACING.PAGE.WIDTH - 75, 50);
  doc.setFontSize(FONTS.NORMAL);
  doc.text(format(data.data_emissao, 'MMM/yy', { locale: ptBR }).toLowerCase(), SPACING.PAGE.WIDTH - 75, 58);

  yPos = 70;

  yPos = addUsinaInfo(doc, data, yPos);
  yPos = addDataTable(doc, data, yPos);

  const fileName = `boletim-medicao-${data.usina.numero_uc}-${format(new Date(), 'MM-yyyy')}.pdf`;

  return { doc, fileName };
};

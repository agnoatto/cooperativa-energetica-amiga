
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";
import { PdfFaturaData } from "@/types/pdf";

export const addConsumptionInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Informações de Consumo", SPACING.MARGIN, yPos);
  
  yPos += 8;
  doc.setFontSize(FONTS.NORMAL);

  const info = [
    { label: "Consumo:", value: `${fatura.consumo_kwh} kWh` },
    { label: "Saldo de Energia:", value: `${fatura.saldo_energia_kwh} kWh` },
    { label: "Percentual de Desconto:", value: `${fatura.unidade_beneficiaria.percentual_desconto}%` }
  ];

  info.forEach((item, index) => {
    const y = yPos + (index * 6);
    doc.text(item.label, SPACING.MARGIN, y);
    doc.text(item.value, SPACING.MARGIN + 80, y);
  });

  return yPos + 25;
};

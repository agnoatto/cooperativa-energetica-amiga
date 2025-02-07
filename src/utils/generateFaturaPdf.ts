
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { addDivider } from "./pdfUtils";
import { formatCurrency } from "./pdfUtils";
import { PdfFaturaData } from "@/types/pdf";
import {
  addHeader,
  addClientInfo,
  addInfoBox,
  addMonthlyAnalysis,
  addBillAnalysis,
  addCogesolBillAnalysis,
  addFooter,
} from "./pdfSections";

export const generateFaturaPdf = (fatura: PdfFaturaData): { doc: jsPDF, fileName: string } => {
  const doc = new jsPDF();
  let yPos = 20;

  // Header
  yPos = addHeader(doc, fatura, yPos);
  
  yPos += 15;
  addDivider(doc, yPos);
  
  // Client Information
  yPos += 15;
  yPos = addClientInfo(doc, fatura, yPos);
  
  // Highlighted Info Boxes
  yPos += 35;
  
  // UC Box
  addInfoBox(doc, {
    x: 20,
    y: yPos,
    width: 50,
    height: 25,
    label: "Unidade Consumidora",
    value: fatura.unidade_beneficiaria.numero_uc
  });
  
  // Due Date Box
  addInfoBox(doc, {
    x: 80,
    y: yPos,
    width: 50,
    height: 25,
    label: "Data Vencimento",
    value: format(new Date(fatura.data_vencimento), 'dd/MM/yyyy')
  });
  
  // Value Box
  addInfoBox(doc, {
    x: 140,
    y: yPos,
    width: 50,
    height: 25,
    label: "Valor a Pagar",
    value: formatCurrency(fatura.valor_total)
  });
  
  // Monthly Analysis
  yPos += 35;
  doc.setFont("helvetica", "bold");
  doc.text("Análise Mensal", 20, yPos);
  doc.setFont("helvetica", "normal");
  yPos += 10;
  
  yPos = addMonthlyAnalysis(doc, fatura, yPos);
  
  // Bill Analysis
  yPos -= 14;
  const totalSemCogesol = addBillAnalysis(doc, fatura, yPos);
  
  // Cogesol Bill Analysis
  yPos += 12;
  const { yPos: newYPos, totalComCogesol } = addCogesolBillAnalysis(doc, fatura, yPos);
  yPos = newYPos;
  
  // Final Economy Box
  yPos += 15;
  const economiaFinal = totalSemCogesol - totalComCogesol;
  doc.setFillColor(197, 255, 114);
  doc.roundedRect(120, yPos - 5, 70, 15, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Economia: ${formatCurrency(economiaFinal)}`, 125, yPos + 5);
  doc.setFont("helvetica", "normal");
  
  // Footer
  yPos = 270;
  addDivider(doc, yPos);
  yPos += 10;
  addFooter(doc, yPos);
  
  // Generate filename
  const fileName = `fatura-${fatura.unidade_beneficiaria.numero_uc}-${fatura.mes}-${fatura.ano}.pdf`;
  
  return { doc, fileName };
};

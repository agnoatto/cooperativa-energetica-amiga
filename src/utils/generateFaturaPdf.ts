
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { addDivider } from "./pdfUtils";
import { formatCurrency } from "./pdfUtils";
import { PdfFaturaData } from "@/types/pdf";
import {
  addHeader,
  addClientInfo,
  addInfoBox,
  addBillAnalysis,
  addCogesolBillAnalysis,
  addEconomySection,
  addCompanyInfo,
  addFooter,
} from "./pdfSections";

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

export const generateFaturaPdf = async (fatura: PdfFaturaData): Promise<{ doc: jsPDF, fileName: string }> => {
  const doc = new jsPDF();
  let yPos = 20;

  try {
    // Logo
    const logoImg = await loadImage('/lovable-uploads/45144fbd-4ede-4bea-bbe1-722ecd73ccfb.png');
    const canvas = document.createElement('canvas');
    canvas.width = logoImg.width;
    canvas.height = logoImg.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(logoImg, 0, 0);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 20, yPos, 40, 15);
    }
  } catch (error) {
    console.error('Failed to load logo:', error);
  }

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
  
  // Bill Analysis
  yPos += 45;
  yPos = addBillAnalysis(doc, fatura, yPos);
  
  // Cogesol Bill Analysis
  yPos += 30;
  yPos = addCogesolBillAnalysis(doc, fatura, yPos);
  
  // Economy Section
  yPos += 30;
  yPos = addEconomySection(doc, fatura, yPos);
  
  // Company Info and Payment Message
  yPos += 15;
  yPos = addCompanyInfo(doc, yPos);
  
  // Footer
  addDivider(doc, yPos);
  yPos += 10;
  addFooter(doc, yPos);
  
  // Generate filename
  const fileName = `fatura-${fatura.unidade_beneficiaria.numero_uc}-${fatura.mes}-${fatura.ano}.pdf`;
  
  return { doc, fileName };
};

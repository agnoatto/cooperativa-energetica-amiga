
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
  addPaymentInfo,
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
  
  // Divisor após o header
  yPos += 15;
  addDivider(doc, yPos);
  
  // Informações do Cliente
  yPos += 15;
  yPos = addClientInfo(doc, fatura, yPos);
  
  // Boxes de informação destacados
  yPos += 35;
  
  // Box UC
  addInfoBox(doc, {
    x: 20,
    y: yPos,
    width: 50,
    height: 35,
    label: "Unidade Consumidora",
    value: fatura.unidade_beneficiaria.numero_uc
  });
  
  // Box Data Vencimento
  addInfoBox(doc, {
    x: 80,
    y: yPos,
    width: 50,
    height: 35,
    label: "Data Vencimento",
    value: format(new Date(fatura.data_vencimento), 'dd/MM/yyyy')
  });
  
  // Box Valor
  addInfoBox(doc, {
    x: 140,
    y: yPos,
    width: 50,
    height: 35,
    label: "Valor a Pagar",
    value: formatCurrency(fatura.valor_total)
  });
  
  // Análise da Fatura
  yPos += 45;
  yPos = addBillAnalysis(doc, fatura, yPos);
  
  // Análise Cogesol
  yPos += 30;
  yPos = addCogesolBillAnalysis(doc, fatura, yPos);
  
  // Seção de Economia
  yPos += 30;
  yPos = addEconomySection(doc, fatura, yPos);
  
  // Informações da Empresa e Mensagem de Pagamento
  yPos += 15;
  yPos = addCompanyInfo(doc, yPos);
  
  // Informações de Pagamento
  yPos = addPaymentInfo(doc, yPos);
  
  // Footer
  addDivider(doc, yPos);
  yPos += 10;
  addFooter(doc, yPos);
  
  // Nome do arquivo
  const fileName = `fatura-${fatura.unidade_beneficiaria.numero_uc}-${fatura.mes}-${fatura.ano}.pdf`;
  
  return { doc, fileName };
};

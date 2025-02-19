
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PdfFaturaData } from "@/types/pdf";
import { addHeader } from "./pdf/header";
import { addClientInfo } from "./pdf/clientInfo";
import { addConsumptionInfo } from "./pdf/consumptionInfo";
import { addValueDetails } from "./pdf/valueDetails";
import { addEconomyInfo } from "./pdf/economyInfo";
import { addCompanyFooter, addPaymentData } from "./pdf/footer";
import { SPACING, FONTS } from "./pdf/constants";

export const generateFaturaPdf = async (fatura: PdfFaturaData): Promise<{ doc: jsPDF, fileName: string }> => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    let yPos = 0;

    // Adicionar cabeçalho com novo logo
    yPos = await addHeader(doc, {
      title: `Relatório Mensal - Ref.: ${format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yyyy', { locale: ptBR })}`,
      logoPath: '/lovable-uploads/254317ca-d03e-40a5-9286-a175e9dd8bbf.png'
    });

    // Adicionar informações do cliente
    yPos = addClientInfo(doc, fatura, yPos);

    // Adicionar informações de consumo
    yPos = addConsumptionInfo(doc, fatura, yPos);

    // Adicionar detalhamento de valores
    yPos = addValueDetails(doc, fatura, yPos);

    // Adicionar informações de economia
    yPos = addEconomyInfo(doc, fatura, yPos);

    // Se houver observação, adicionar
    if (fatura.observacao) {
      doc.setFontSize(FONTS.SUBTITLE);
      doc.text("Observações", SPACING.MARGIN, yPos);
      yPos += 8;
      doc.setFontSize(FONTS.NORMAL);
      doc.text(fatura.observacao, SPACING.MARGIN, yPos, {
        maxWidth: SPACING.PAGE.WIDTH - (SPACING.MARGIN * 2)
      });
      yPos += 20;
    }

    // Adicionar rodapé na última página
    yPos = addCompanyFooter(doc, fatura.valor_assinatura, yPos);
    addPaymentData(doc, yPos);

    // Nome do arquivo
    const fileName = `fatura-${fatura.unidade_beneficiaria.numero_uc}-${String(fatura.mes).padStart(2, '0')}-${fatura.ano}.pdf`;

    return { doc, fileName };
  } catch (error) {
    console.error('Erro na geração do PDF:', error);
    throw new Error('Falha ao gerar o PDF. Por favor, tente novamente.');
  }
};

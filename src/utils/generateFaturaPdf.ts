
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PdfFaturaData } from "@/types/pdf";
import { addHeader } from "./pdf/header";
import { addClientInfo } from "./pdf/clientInfo";
import { addConsumptionInfo } from "./pdf/consumptionInfo";
import { addValueDetails } from "./pdf/valueDetails";
import { addEconomyInfo } from "./pdf/economyInfo";
import { addStatusHistory } from "./pdf/statusHistory";
import { addCompanyFooter, addPaymentData } from "./pdf/footer";

export const generateFaturaPdf = async (fatura: PdfFaturaData): Promise<{ doc: jsPDF, fileName: string }> => {
  try {
    // Criar novo documento PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    let yPos = 0;

    // Adicionar cabeçalho
    yPos = await addHeader(doc, {
      title: `Relatório Mensal - Ref.: ${format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yyyy', { locale: ptBR })}`,
      logoPath: '/lovable-uploads/45144fbd-4ede-4bea-bbe1-722ecd73ccfb.png',
      status: fatura.status
    });

    // Adicionar informações do cliente
    yPos = addClientInfo(doc, fatura, yPos);

    // Adicionar informações de consumo
    yPos = addConsumptionInfo(doc, fatura, yPos);

    // Adicionar detalhamento de valores
    yPos = addValueDetails(doc, fatura, yPos);

    // Adicionar informações de economia
    yPos = addEconomyInfo(doc, fatura, yPos);

    // Adicionar histórico de status (se existir e houver espaço na página)
    if (fatura.historico_status && fatura.historico_status.length > 0) {
      // Verificar se precisa de nova página
      if (yPos > SPACING.PAGE.HEIGHT - 100) {
        doc.addPage();
        yPos = 20;
      }
      yPos = addStatusHistory(doc, fatura.historico_status, yPos);
    }

    // Adicionar rodapé
    yPos = addCompanyFooter(doc, fatura.valor_total, yPos);

    // Adicionar mensagem de pagamento
    addPaymentData(doc, yPos);

    // Nome do arquivo
    const fileName = `fatura-${fatura.unidade_beneficiaria.numero_uc}-${String(fatura.mes).padStart(2, '0')}-${fatura.ano}.pdf`;

    return { doc, fileName };
  } catch (error) {
    console.error('Erro na geração do PDF:', error);
    throw new Error('Falha ao gerar o PDF. Por favor, tente novamente.');
  }
};

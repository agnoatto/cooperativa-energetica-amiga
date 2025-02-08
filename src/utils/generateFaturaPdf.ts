
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PdfFaturaData } from "@/types/pdf";
import { addHeader } from "./pdf/header";
import { addClientInfo, addHighlightBoxes } from "./pdf/clientInfo";
import { addMonthlyAnalysis } from "./pdf/monthlyAnalysis";
import { addCompanyFooter, addPaymentData } from "./pdf/footer";

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Falha ao carregar a imagem'));
    img.src = url;
  });
};

export const generateFaturaPdf = async (fatura: PdfFaturaData): Promise<{ doc: jsPDF, fileName: string }> => {
  try {
    const doc = new jsPDF();
    let yPos = 0;

    // Adiciona o cabeçalho com fundo azul escuro
    yPos = addHeader(doc, {
      title: `Relatório Mensal - Ref.: ${format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yyyy', { locale: ptBR })}`,
      logoPath: '/lovable-uploads/45144fbd-4ede-4bea-bbe1-722ecd73ccfb.png'
    });

    // Informações do cliente e boxes destacados
    yPos = addClientInfo(doc, fatura, yPos);
    yPos = addHighlightBoxes(doc, {
      uc: fatura.unidade_beneficiaria.numero_uc,
      dueDate: format(new Date(fatura.data_vencimento), 'dd/MM/yyyy'),
      amount: fatura.valor_total.toString()
    }, yPos);

    // Análise mensal (consumo, economia, histórico)
    yPos = addMonthlyAnalysis(doc, {
      consumo: fatura.consumo_kwh,
      valorFaturaSemCogesol: fatura.total_fatura,
      valorFaturaComCogesol: fatura.valor_total,
      economiaAcumulada: fatura.economia_acumulada,
      faturaConcessionaria: fatura.fatura_concessionaria
    }, yPos);

    // Rodapé com informações da empresa
    yPos = addCompanyFooter(doc, fatura.valor_total, yPos);

    // Dados de pagamento
    addPaymentData(doc, yPos);

    // Nome do arquivo
    const fileName = `fatura-${fatura.unidade_beneficiaria.numero_uc}-${String(fatura.mes).padStart(2, '0')}-${fatura.ano}.pdf`;

    return { doc, fileName };
  } catch (error) {
    console.error('Erro na geração do PDF:', error);
    throw new Error('Falha ao gerar o PDF. Por favor, tente novamente.');
  }
};

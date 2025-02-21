
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PagamentoPdfButtonProps {
  pagamento: {
    geracao_kwh: number;
    valor_tusd_fio_b: number;
    conta_energia: number;
    valor_total: number;
    status: string;
    data_vencimento: string;
    data_pagamento: string | null;
    mes: number;
    ano: number;
    usina: {
      unidade_usina: {
        numero_uc: string;
      };
      investidor: {
        nome_investidor: string;
      };
    };
  };
  className?: string;
}

export function PagamentoPdfButton({ pagamento, className }: PagamentoPdfButtonProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const gerarPDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Cabeçalho
      doc.setFontSize(20);
      doc.text("Recibo de Pagamento", 20, yPos);
      
      yPos += 20;
      doc.setFontSize(12);
      doc.text(`Competência: ${format(new Date(pagamento.ano, pagamento.mes - 1), 'MMMM/yyyy', { locale: ptBR })}`, 20, yPos);
      
      yPos += 10;
      doc.text(`Unidade Consumidora: ${pagamento.usina.unidade_usina.numero_uc}`, 20, yPos);
      
      yPos += 10;
      doc.text(`Investidor: ${pagamento.usina.investidor.nome_investidor}`, 20, yPos);
      
      yPos += 20;
      doc.text("Detalhamento", 20, yPos);
      
      yPos += 10;
      doc.text(`Geração: ${pagamento.geracao_kwh} kWh`, 20, yPos);
      
      yPos += 10;
      doc.text(`TUSD Fio B: ${formatCurrency(pagamento.valor_tusd_fio_b)}`, 20, yPos);
      
      yPos += 10;
      doc.text(`Conta de Energia: ${formatCurrency(pagamento.conta_energia)}`, 20, yPos);
      
      yPos += 10;
      doc.text(`Valor Total: ${formatCurrency(pagamento.valor_total)}`, 20, yPos);
      
      yPos += 20;
      doc.text(`Status: ${pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}`, 20, yPos);
      
      yPos += 10;
      doc.text(`Data de Vencimento: ${format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy')}`, 20, yPos);
      
      if (pagamento.data_pagamento) {
        yPos += 10;
        doc.text(`Data de Pagamento: ${format(new Date(pagamento.data_pagamento), 'dd/MM/yyyy')}`, 20, yPos);
      }

      // Salvar o PDF
      doc.save(`pagamento-${pagamento.usina.unidade_usina.numero_uc}-${pagamento.mes}-${pagamento.ano}.pdf`);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={gerarPDF}
      title="Imprimir Pagamento"
      className={className}
    >
      <Printer className="h-4 w-4" />
    </Button>
  );
}


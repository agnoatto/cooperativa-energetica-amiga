import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface CooperadoPdfButtonProps {
  cooperado: {
    nome: string;
    documento: string;
    tipo_pessoa: string;
    telefone: string;
    email: string;
    responsavel_nome?: string;
    responsavel_cpf?: string;
    responsavel_telefone?: string;
  };
  unidades: Array<{
    numero_uc: string;
    apelido?: string;
    endereco: string;
    percentual_desconto: number;
    data_entrada: string;
    data_saida?: string;
  }>;
}

export function CooperadoPdfButton({ cooperado, unidades }: CooperadoPdfButtonProps) {
  const formatarDocumento = (doc: string) => {
    if (!doc) return '-';
    const numero = doc.replace(/\D/g, '');
    if (numero.length === 11) {
      return numero.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    }
    return numero.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
  };

  const formatarTelefone = (telefone: string) => {
    if (!telefone) return '-';
    const numero = telefone.replace(/\D/g, '');
    if (numero.length === 11) {
      return numero.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
    }
    return numero.replace(/(\d{2})(\d{4})(\d{4})/g, '($1) $2-$3');
  };

  const gerarPDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Título
      doc.setFontSize(16);
      doc.text("Dados do Cooperado", 20, yPos);
      
      // Dados do cooperado
      doc.setFontSize(12);
      yPos += 20;
      doc.text(`Nome: ${cooperado.nome}`, 20, yPos);
      yPos += 10;
      doc.text(`${cooperado.tipo_pessoa === 'PJ' ? 'CNPJ' : 'CPF'}: ${formatarDocumento(cooperado.documento)}`, 20, yPos);
      yPos += 10;
      doc.text(`Telefone: ${formatarTelefone(cooperado.telefone)}`, 20, yPos);
      yPos += 10;
      doc.text(`Email: ${cooperado.email || '-'}`, 20, yPos);

      // Dados do responsável (se PJ)
      if (cooperado.tipo_pessoa === 'PJ' && cooperado.responsavel_nome) {
        yPos += 20;
        doc.setFontSize(14);
        doc.text("Dados do Responsável", 20, yPos);
        doc.setFontSize(12);
        yPos += 10;
        doc.text(`Nome: ${cooperado.responsavel_nome}`, 20, yPos);
        yPos += 10;
        doc.text(`CPF: ${formatarDocumento(cooperado.responsavel_cpf || '')}`, 20, yPos);
        yPos += 10;
        doc.text(`Telefone: ${formatarTelefone(cooperado.responsavel_telefone || '')}`, 20, yPos);
      }

      // Unidades Beneficiárias
      yPos += 20;
      doc.setFontSize(14);
      doc.text("Unidades Beneficiárias", 20, yPos);
      doc.setFontSize(12);

      unidades.forEach((unidade) => {
        yPos += 15;
        if (yPos > 270) { // Nova página se necessário
          doc.addPage();
          yPos = 20;
        }
        doc.text(`UC: ${unidade.numero_uc}${unidade.apelido ? ` (${unidade.apelido})` : ''}`, 20, yPos);
        yPos += 10;
        doc.text(`Endereço: ${unidade.endereco}`, 20, yPos);
        yPos += 10;
        doc.text(`Desconto: ${unidade.percentual_desconto}%`, 20, yPos);
        yPos += 10;
        doc.text(`Data Entrada: ${new Date(unidade.data_entrada).toLocaleDateString()}`, 20, yPos);
        if (unidade.data_saida) {
          yPos += 10;
          doc.text(`Data Saída: ${new Date(unidade.data_saida).toLocaleDateString()}`, 20, yPos);
        }
        yPos += 5; // Espaço entre unidades
      });

      // Salvar o PDF
      doc.save(`cooperado-${cooperado.nome.toLowerCase().replace(/\s+/g, '-')}.pdf`);
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
      title="Gerar PDF"
    >
      <FileDown className="h-4 w-4" />
    </Button>
  );
}
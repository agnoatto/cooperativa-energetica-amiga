
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PagamentoData } from './types/pagamento';
import { generatePagamentoPdf } from '@/utils/generatePagamentoPdf';

interface PagamentoPdfButtonProps {
  pagamento: PagamentoData;
  id?: string;
}

export function PagamentoPdfButton({ pagamento, id }: PagamentoPdfButtonProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGerarPdf = async () => {
    try {
      setIsGenerating(true);
      
      // Adaptando os dados para o formato esperado pelo gerador de PDF
      const dadosFormatados = {
        geracao_kwh: pagamento.geracao_kwh,
        valor_tusd_fio_b: pagamento.valor_tusd_fio_b,
        conta_energia: pagamento.valor_concessionaria, // Usando o valor_concessionaria como conta_energia
        valor_total: pagamento.valor_total,
        status: pagamento.status,
        data_vencimento: pagamento.data_vencimento,
        data_pagamento: pagamento.data_pagamento || '',
        mes: pagamento.mes,
        ano: pagamento.ano,
        usina: pagamento.usina,
      };

      await generatePagamentoPdf(dadosFormatados);
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('[PDF] Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      id={id}
      variant="outline"
      size="icon"
      onClick={handleGerarPdf}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
    </Button>
  );
}

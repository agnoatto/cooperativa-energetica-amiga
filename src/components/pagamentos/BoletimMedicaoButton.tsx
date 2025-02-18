
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { generateBoletimPdf } from "@/utils/generateBoletimPdf";
import { toast } from "sonner";
import { BoletimData } from "./types/boletim";
import { PagamentoData } from "./types/pagamento";

interface BoletimMedicaoButtonProps {
  pagamento: PagamentoData;
  getPagamentosUltimos12Meses: (pagamento: PagamentoData) => Promise<PagamentoData[]>;
}

export function BoletimMedicaoButton({ 
  pagamento,
  getPagamentosUltimos12Meses 
}: BoletimMedicaoButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGerarBoletim = async () => {
    try {
      setIsGenerating(true);
      console.log("[Boletim] Buscando histórico de pagamentos...");
      
      const pagamentosHistorico = await getPagamentosUltimos12Meses(pagamento);
      console.log("[Boletim] Histórico obtido:", pagamentosHistorico.length, "pagamentos");

      const boletimData: BoletimData = {
        usina: {
          nome_investidor: pagamento.usina.investidor.nome_investidor,
          numero_uc: pagamento.usina.unidade_usina.numero_uc,
          valor_kwh: pagamento.usina.valor_kwh
        },
        pagamentos: pagamentosHistorico,
        data_emissao: pagamento.data_emissao ? new Date(pagamento.data_emissao) : new Date(),
        data_vencimento: pagamento.data_vencimento,
        valor_receber: pagamento.valor_total
      };

      console.log("[Boletim] Gerando PDF...");
      const { doc, fileName } = await generateBoletimPdf(boletimData);
      doc.save(fileName);
      toast.success("Boletim de medição gerado com sucesso!");
    } catch (error) {
      console.error("[Boletim] Erro ao gerar boletim:", error);
      toast.error("Erro ao gerar boletim de medição");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleGerarBoletim}
      disabled={isGenerating}
      title="Gerar Boletim de Medição"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
    </Button>
  );
}

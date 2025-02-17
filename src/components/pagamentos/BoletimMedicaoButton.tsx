
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { generateBoletimPdf } from "@/utils/generateBoletimPdf";
import { toast } from "sonner";
import { PagamentoData } from "./types/pagamento";
import { BoletimData } from "./types/boletim";

interface BoletimMedicaoButtonProps {
  boletimData: BoletimData;
}

export function BoletimMedicaoButton({ boletimData }: BoletimMedicaoButtonProps) {
  const handleGerarBoletim = async () => {
    try {
      const { doc, fileName } = await generateBoletimPdf({
        ...boletimData,
        usina: {
          nome_investidor: boletimData.usina.nome_investidor,
          numero_uc: boletimData.usina.numero_uc,
          valor_kwh: boletimData.usina.valor_kwh
        },
        pagamentos: boletimData.pagamentos.map(p => ({
          geracao_kwh: p.geracao_kwh,
          valor_total: p.valor_total,
          data_vencimento: p.data_vencimento,
          mes: p.mes,
          ano: p.ano
        }))
      });

      // Gerar e fazer download do PDF
      doc.save(fileName);
      
      toast.success("Boletim de medição gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar boletim:", error);
      toast.error("Erro ao gerar boletim de medição");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleGerarBoletim}
      title="Gerar Boletim de Medição"
    >
      <FileText className="h-4 w-4" />
    </Button>
  );
}

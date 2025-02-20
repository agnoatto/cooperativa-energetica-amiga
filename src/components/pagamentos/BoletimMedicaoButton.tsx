
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { generateBoletimPdf } from "@/utils/generateBoletimPdf";
import { toast } from "sonner";
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
      const { doc, fileName } = await generateBoletimPdf(pagamento);
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

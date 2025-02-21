
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PagamentoData } from "./types/pagamento";
import { pdf } from '@react-pdf/renderer';
import { BoletimPDF } from "../pdf/BoletimPDF";

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
      
      // Gerar o PDF usando o novo componente React-PDF
      const blob = await pdf(
        <BoletimPDF pagamento={pagamento} />
      ).toBlob();
      
      // Criar URL do blob e iniciar download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `boletim_pagamento_${pagamento.mes}_${pagamento.ano}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

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

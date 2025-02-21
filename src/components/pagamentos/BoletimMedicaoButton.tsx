import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import { PagamentoData } from "./types/pagamento";
import { pdf } from '@react-pdf/renderer';
import { BoletimPDF } from "../pdf/BoletimPDF";
import { BoletimPreviewDialog } from "./BoletimPreviewDialog";
import { usePagamentosHistorico } from "./hooks/usePagamentosHistorico";

interface BoletimMedicaoButtonProps {
  pagamento: PagamentoData;
  getPagamentosUltimos12Meses: (pagamento: PagamentoData) => Promise<PagamentoData[]>;
  id?: string;
}

export function BoletimMedicaoButton({ 
  pagamento,
  getPagamentosUltimos12Meses,
  id
}: BoletimMedicaoButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGerarBoletim = async () => {
    try {
      setIsGenerating(true);
      
      const historico = await getPagamentosUltimos12Meses(pagamento);
      
      const blob = await pdf(
        <BoletimPDF 
          pagamento={pagamento} 
          historicoData={historico}
        />
      ).toBlob();
      
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
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowPreview(true)}
          title="Visualizar Boletim de Medição"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          id={id}
          variant="outline"
          size="icon"
          onClick={handleGerarBoletim}
          disabled={isGenerating}
          title="Baixar Boletim de Medição"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </Button>
      </div>

      <BoletimPreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        pagamento={pagamento}
      />
    </>
  );
}

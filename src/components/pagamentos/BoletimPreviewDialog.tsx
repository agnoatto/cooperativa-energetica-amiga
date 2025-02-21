
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import { BoletimPDF } from "../pdf/BoletimPDF";
import { PagamentoData } from "./types/pagamento";
import { usePagamentosHistorico } from "./hooks/usePagamentosHistorico";

interface BoletimPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pagamento: PagamentoData;
}

export function BoletimPreviewDialog({
  isOpen,
  onClose,
  pagamento,
}: BoletimPreviewDialogProps) {
  const [historicoData, setHistoricoData] = useState<PagamentoData[]>([]);
  const { getPagamentosUltimos12Meses } = usePagamentosHistorico();

  useEffect(() => {
    const carregarHistorico = async () => {
      if (isOpen && pagamento) {
        try {
          const historico = await getPagamentosUltimos12Meses(pagamento);
          setHistoricoData(historico);
        } catch (error) {
          console.error("Erro ao carregar histórico:", error);
        }
      }
    };

    carregarHistorico();
  }, [isOpen, pagamento, getPagamentosUltimos12Meses]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogTitle>Visualização do Boletim de Medição</DialogTitle>
        <PDFViewer width="100%" height="100%" className="rounded-lg">
          <BoletimPDF 
            pagamento={pagamento}
            historicoData={historicoData}
          />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
}

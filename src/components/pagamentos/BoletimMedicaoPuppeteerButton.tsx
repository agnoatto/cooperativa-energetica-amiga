
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { BoletimMedicaoData } from "./types/boletim";
import { supabase } from "@/integrations/supabase/client";

interface BoletimMedicaoPuppeteerButtonProps {
  boletimData: BoletimMedicaoData;
}

export function BoletimMedicaoPuppeteerButton({ boletimData }: BoletimMedicaoPuppeteerButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const gerarPDF = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-pdf-puppeteer', {
        body: { boletimData }
      });

      if (error) throw error;

      // Convert the response to a blob and create a download link
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boletim-${boletimData.usina.numero_uc}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={gerarPDF}
      title="Gerar Boletim (Experimental)"
      disabled={isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Printer className="h-4 w-4" />
      )}
    </Button>
  );
}

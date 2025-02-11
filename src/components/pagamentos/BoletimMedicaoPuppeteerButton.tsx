
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

  console.log('BoletimMedicaoPuppeteerButton rendered with data:', boletimData);

  const gerarPDF = async () => {
    console.log('Iniciando geração do PDF...');
    setIsGenerating(true);
    try {
      console.log('Chamando Edge Function com dados:', boletimData);
      const { data, error } = await supabase.functions.invoke('generate-pdf-puppeteer', {
        body: { boletimData }
      });

      if (error) {
        console.error('Erro da Edge Function:', error);
        throw error;
      }

      console.log('Resposta da Edge Function:', data);

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
      console.error('Erro detalhado ao gerar PDF:', error);
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
      className="h-6 w-6" // Ajustando tamanho para corresponder aos outros botões
    >
      {isGenerating ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Printer className="h-3 w-3" />
      )}
    </Button>
  );
}

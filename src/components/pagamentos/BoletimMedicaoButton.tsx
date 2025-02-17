
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { generateBoletimPdf } from "@/utils/generateBoletimPdf";
import { BoletimMedicaoData } from "./types/boletim";
import { PagamentoData } from "./types/pagamento";
import { supabase } from "@/integrations/supabase/client";

interface BoletimMedicaoButtonProps {
  boletimData: BoletimMedicaoData;
}

export function BoletimMedicaoButton({ boletimData }: BoletimMedicaoButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const gerarPDF = async () => {
    setIsGenerating(true);
    try {
      // Buscar todos os pagamentos da usina
      const { data: pagamentos, error } = await supabase
        .from("pagamentos_usina")
        .select("*")
        .eq("usina_id", boletimData.usina.id)
        .order('ano', { ascending: false })
        .order('mes', { ascending: false });

      if (error) {
        throw error;
      }

      // Criar dados do boletim com todos os pagamentos
      const boletimComHistorico: BoletimMedicaoData = {
        ...boletimData,
        pagamentos: pagamentos as PagamentoData[]
      };

      const { doc, fileName } = await generateBoletimPdf(boletimComHistorico);
      doc.save(fileName);
      toast.success("Boletim de Medição gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar boletim. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={gerarPDF}
      title="Gerar Boletim de Medição"
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


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { generateBoletimPdf } from "@/utils/generateBoletimPdf";
import { toast } from "sonner";
import { BoletimData } from "./types/boletim";

interface BoletimMedicaoButtonProps {
  boletimData: BoletimData;
}

export function BoletimMedicaoButton({ boletimData }: BoletimMedicaoButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGerarBoletim = async () => {
    try {
      setIsGenerating(true);
      const { doc, fileName } = await generateBoletimPdf(boletimData);
      doc.save(fileName);
      toast.success("Boletim de medição gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar boletim:", error);
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
      <FileText className="h-4 w-4" />
    </Button>
  );
}


import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { FaturaMobileCard } from "./FaturaMobileCard";
import { PdfPreview } from "../../upload/PdfPreview";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FaturasMobileListProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturasMobileList({
  faturas,
  onViewDetails,
  onDelete,
  onUpdateStatus
}: FaturasMobileListProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);

  const handleViewPdf = async (fatura: Fatura) => {
    if (!fatura.arquivo_concessionaria_path) {
      toast.error("Nenhum arquivo de fatura disponível");
      return;
    }

    try {
      setSelectedFatura(fatura);
      const { data: storageUrl } = await supabase.storage
        .from("faturas")
        .createSignedUrl(fatura.arquivo_concessionaria_path, 3600);

      if (storageUrl?.signedUrl) {
        setPdfUrl(storageUrl.signedUrl);
        setShowPdfPreview(true);
      } else {
        toast.error("Não foi possível acessar o arquivo");
      }
    } catch (error) {
      console.error("Erro ao obter URL do PDF:", error);
      toast.error("Erro ao carregar o PDF");
    }
  };

  const handleClosePdfPreview = () => {
    setShowPdfPreview(false);
    setPdfUrl(null);
    setSelectedFatura(null);
  };

  return (
    <>
      <div className="mt-4">
        {faturas.map((fatura) => (
          <FaturaMobileCard
            key={fatura.id}
            fatura={fatura}
            onViewDetails={onViewDetails}
            onViewPdf={() => handleViewPdf(fatura)}
          />
        ))}
      </div>

      <PdfPreview
        isOpen={showPdfPreview}
        onClose={handleClosePdfPreview}
        pdfUrl={pdfUrl}
      />
    </>
  );
}

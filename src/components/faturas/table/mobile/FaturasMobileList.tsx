
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { FaturaMobileCard } from "./FaturaMobileCard";
import { PdfPreview } from "../../upload/PdfPreview";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { STORAGE_BUCKET } from "../../upload/constants";

interface FaturasMobileListProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturasMobileList({
  faturas,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus
}: FaturasMobileListProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const handleViewPdf = async (fatura: Fatura) => {
    if (!fatura.arquivo_concessionaria_path) {
      toast.error("Nenhum arquivo de fatura disponível");
      return;
    }

    setIsLoadingPdf(true);
    const toastId = toast.loading("Carregando visualização...");

    try {
      setSelectedFatura(fatura);
      
      // Verificar se o arquivo existe antes de tentar obter a URL assinada
      const { data: fileExists } = await supabase
        .storage
        .from(STORAGE_BUCKET)
        .list(fatura.arquivo_concessionaria_path.split('/')[0], {
          limit: 1,
          offset: 0,
          search: fatura.arquivo_concessionaria_path.split('/')[1]
        });
      
      if (!fileExists || fileExists.length === 0) {
        throw new Error("Arquivo não encontrado no storage");
      }

      // Obter URL assinada
      const { data: storageUrl, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(fatura.arquivo_concessionaria_path, 3600);

      if (error) {
        throw error;
      }

      if (storageUrl?.signedUrl) {
        setPdfUrl(storageUrl.signedUrl);
        setShowPdfPreview(true);
        toast.success("PDF carregado com sucesso!", { id: toastId });
      } else {
        throw new Error("Não foi possível gerar a URL assinada");
      }
    } catch (error: any) {
      console.error("Erro ao obter URL do PDF:", error);
      toast.error(`Erro ao carregar o PDF: ${error.message}`, { id: toastId });
      setPdfUrl(null);
    } finally {
      setIsLoadingPdf(false);
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
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
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

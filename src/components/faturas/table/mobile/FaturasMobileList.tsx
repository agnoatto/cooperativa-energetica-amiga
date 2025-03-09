
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { FaturaMobileCard } from "./FaturaMobileCard";
import { PdfPreview } from "../../upload/PdfPreview";
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
  const [previewTitle, setPreviewTitle] = useState<string>("Visualização da Conta de Energia");

  const handleViewPdf = async (fatura: Fatura) => {
    if (!fatura.arquivo_concessionaria_path) {
      return;
    }

    setPdfUrl(fatura.arquivo_concessionaria_path);
    setPreviewTitle("Visualização da Conta de Energia");
    setShowPdfPreview(true);
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
        onClose={() => {
          setShowPdfPreview(false);
          setPdfUrl(null);
        }}
        pdfUrl={pdfUrl}
        title={previewTitle}
        bucketName={STORAGE_BUCKET} // Adicionando o nome do bucket explicitamente
      />
    </>
  );
}

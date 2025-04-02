
/**
 * Lista de faturas otimizada para mobile
 * 
 * Este componente exibe as faturas em formato de lista de cards,
 * otimizado para visualização em dispositivos móveis.
 */
import { useState } from "react";
import { Fatura, FaturaStatus } from "@/types/fatura";
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
  const [selectedFaturaPdf, setSelectedFaturaPdf] = useState<Fatura | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const handleViewPdf = (fatura: Fatura) => {
    if (fatura.arquivo_concessionaria_path) {
      setSelectedFaturaPdf(fatura);
      setShowPdfPreview(true);
    }
  };

  return (
    <div className="space-y-4">
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

      {selectedFaturaPdf && showPdfPreview && (
        <PdfPreview
          isOpen={showPdfPreview}
          onClose={() => setShowPdfPreview(false)}
          pdfUrl={selectedFaturaPdf.arquivo_concessionaria_path}
          title="Visualização da Conta de Energia"
          bucketName={STORAGE_BUCKET}
        />
      )}
    </div>
  );
}

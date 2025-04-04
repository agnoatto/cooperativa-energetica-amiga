
/**
 * Componente de linha de tabela para faturas
 * 
 * Este componente renderiza uma linha da tabela de faturas, adaptando-se
 * para visualização em dispositivos móveis ou desktop.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useIsMobile } from "@/hooks/use-mobile";
import { FaturaMobileCard } from "./mobile/FaturaMobileCard";
import { FaturaDesktopRow } from "./desktop/FaturaDesktopRow";
import { PdfVisualizationHandler } from "./components/PdfVisualizationHandler";
import { PdfPreview } from "../upload/PdfPreview";

interface FaturaTableRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturaTableRow({
  fatura,
  onViewDetails,
  onDelete,
  onEdit,
  onUpdateStatus
}: FaturaTableRowProps) {
  const isMobile = useIsMobile();
  
  // Usar o handler para visualização de PDF
  const {
    showPdfPreview,
    pdfBlobUrl,
    isConcessionariaPreview,
    handleViewConcessionaria,
    handleViewRelatorio,
    handleClosePdfPreview
  } = PdfVisualizationHandler({ fatura });

  if (isMobile) {
    return (
      <>
        <FaturaMobileCard 
          fatura={fatura}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
          onViewPdf={handleViewConcessionaria}
        />

        {/* Visualizador de PDF unificado */}
        {showPdfPreview && (
          <PdfPreview
            isOpen={showPdfPreview}
            onClose={handleClosePdfPreview}
            pdfUrl={isConcessionariaPreview ? fatura.arquivo_concessionaria_path : pdfBlobUrl}
            title={isConcessionariaPreview ? "Fatura da Concessionária" : "Relatório Mensal"}
            isRelatorio={!isConcessionariaPreview}
          />
        )}
      </>
    );
  }

  return (
    <>
      <FaturaDesktopRow
        fatura={fatura}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
        onEdit={onEdit}
        onUpdateStatus={onUpdateStatus}
        onViewPdf={handleViewConcessionaria}
      />

      {/* Visualizador de PDF unificado */}
      {showPdfPreview && (
        <PdfPreview
          isOpen={showPdfPreview}
          onClose={handleClosePdfPreview}
          pdfUrl={isConcessionariaPreview ? fatura.arquivo_concessionaria_path : pdfBlobUrl}
          title={isConcessionariaPreview ? "Fatura da Concessionária" : "Relatório Mensal"}
          isRelatorio={!isConcessionariaPreview}
        />
      )}
    </>
  );
}

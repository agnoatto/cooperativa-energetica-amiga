
/**
 * Tabela de faturas para desktop
 * 
 * Este componente exibe as faturas em um formato de tabela estilo Excel 
 * com funcionalidades avançadas como redimensionamento de colunas, 
 * personalização de colunas visíveis e rolagem horizontal suave.
 * Substitui a implementação anterior para melhor exibição de dados.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import { FaturasExcelTable } from "./FaturasExcelTable";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FaturasDesktopTableProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturasDesktopTable({
  faturas,
  onViewDetails,
  onDelete,
  onEdit,
  onUpdateStatus
}: FaturasDesktopTableProps) {
  
  const handleViewPdf = () => {
    console.log("Visualizar PDF");
    // A implementação real seria feita no componente PdfVisualizationHandler
  };

  return (
    <ScrollArea className="w-full rounded-md border h-[calc(100vh-15rem)] bg-white">
      <div className="h-full overflow-hidden">
        <FaturasExcelTable 
          faturas={faturas}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
          onEdit={onEdit}
          onUpdateStatus={onUpdateStatus}
          onViewPdf={handleViewPdf}
        />
      </div>
    </ScrollArea>
  );
}

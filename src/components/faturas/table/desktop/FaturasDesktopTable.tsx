
import { Fatura, FaturaStatus } from "@/types/fatura";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaturaDesktopRow } from "./FaturaDesktopRow";
import { useState } from "react";
import { PdfPreview } from "../../upload/PdfPreview";

interface FaturasDesktopTableProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturasDesktopTable({
  faturas,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus
}: FaturasDesktopTableProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);

  const handleViewPdf = async (fatura: Fatura) => {
    setSelectedFatura(fatura);
    setShowPdfPreview(true);
  };

  return (
    <>
      <div className="rounded-md border border-gray-200 overflow-hidden">
        <Table className="w-full [&_th]:bg-gray-50 [&_th]:font-medium [&_th]:text-gray-700 [&_th]:h-9 [&_tr]:border-b [&_tr]:border-gray-200">
          <TableHeader className="[&_tr]:border-b [&_tr]:border-gray-200">
            <TableRow className="h-9">
              <TableHead className="py-1.5 px-3 text-sm">UC</TableHead>
              <TableHead className="py-1.5 px-3 text-sm">Cooperado</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-right">Consumo</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-right">Valor</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-right">Vencimento</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-right">Status</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-center">Fatura Concessionária</TableHead>
              <TableHead className="py-1.5 px-3 text-sm w-10 text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faturas.map((fatura) => (
              <FaturaDesktopRow
                key={fatura.id}
                fatura={fatura}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateStatus={onUpdateStatus}
                onViewPdf={handleViewPdf}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedFatura && (
        <PdfPreview
          isOpen={showPdfPreview}
          onClose={() => {
            setShowPdfPreview(false);
            setSelectedFatura(null);
          }}
          pdfUrl={selectedFatura.arquivo_concessionaria_path}
          title="Visualização da Conta de Energia"
        />
      )}
    </>
  );
}

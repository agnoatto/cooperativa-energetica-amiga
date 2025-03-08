
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
                onViewPdf={() => handleViewPdf(fatura)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <PdfPreview
        isOpen={showPdfPreview}
        onClose={handleClosePdfPreview}
        pdfUrl={pdfUrl}
      />
    </>
  );
}

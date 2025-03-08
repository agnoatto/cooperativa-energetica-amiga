
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="h-9">
              <TableHead className="w-[100px] py-2">UC</TableHead>
              <TableHead className="py-2">Cooperado</TableHead>
              <TableHead className="text-right py-2 w-[100px]">Consumo</TableHead>
              <TableHead className="text-right py-2 w-[120px]">Valor Assinatura</TableHead>
              <TableHead className="text-right py-2 w-[120px]">Vencimento</TableHead>
              <TableHead className="text-right py-2 w-[100px]">Status</TableHead>
              <TableHead className="text-right py-2 w-[60px]">Ações</TableHead>
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

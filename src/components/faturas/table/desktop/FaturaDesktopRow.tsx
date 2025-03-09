
import { Fatura, FaturaStatus } from "@/types/fatura";
import { TableCell, TableRow } from "@/components/ui/table";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { format } from "date-fns";
import { useState } from "react";
import { FaturaActionsMenu } from "../FaturaActionsMenu";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfPreview } from "../../upload/PdfPreview";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { FaturaPDF } from "../../pdf/FaturaPDF";

interface FaturaDesktopRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onViewPdf: (fatura: Fatura) => void;
}

export function FaturaDesktopRow({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onViewPdf
}: FaturaDesktopRowProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  const handleViewArquivoConcessionaria = async () => {
    if (!fatura.arquivo_concessionaria_path) {
      toast.error("Nenhum arquivo de fatura disponível");
      return;
    }
    
    // Usando o componente de visualização
    setShowPdfPreview(true);
  };

  return (
    <>
      <TableRow key={fatura.id} className="h-9 hover:bg-gray-50">
        <TableCell className="py-1.5 px-3 text-sm">{fatura.unidade_beneficiaria.numero_uc}</TableCell>
        <TableCell className="py-1.5 px-3 text-sm font-medium truncate max-w-[180px]">
          {fatura.unidade_beneficiaria.cooperado.nome}
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-right">
          {fatura.consumo_kwh || 0} kWh
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-right">
          {formatCurrency(fatura.valor_assinatura || 0)}
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-right">
          {formatDate(fatura.data_vencimento)}
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-right">
          <FaturaStatusBadge fatura={fatura} />
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-center">
          {fatura.arquivo_concessionaria_path ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary"
              onClick={handleViewArquivoConcessionaria}
              title="Ver fatura concessionária"
            >
              <FileText className="h-4 w-4" />
            </Button>
          ) : (
            <span className="text-xs text-gray-400">Não anexada</span>
          )}
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm w-10">
          <FaturaActionsMenu
            fatura={fatura}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            onShowPaymentModal={() => setShowPaymentModal(true)}
          />
        </TableCell>
      </TableRow>

      <PdfPreview
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        pdfUrl={fatura.arquivo_concessionaria_path}
        title="Visualização da Conta de Energia"
      />
    </>
  );
}

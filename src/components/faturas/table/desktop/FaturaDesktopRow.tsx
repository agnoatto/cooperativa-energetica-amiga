
import { Fatura, FaturaStatus } from "@/types/fatura";
import { TableCell, TableRow } from "@/components/ui/table";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { format } from "date-fns";
import { useState } from "react";
import { FaturaActionsMenu } from "../FaturaActionsMenu";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimplePdfViewer } from "../../upload/SimplePdfViewer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { STORAGE_BUCKET } from "../../upload/constants";

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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

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

    setIsLoadingPdf(true);
    const toastId = toast.loading("Carregando visualização...");

    try {
      // Obter URL assinada diretamente sem verificar a existência do arquivo primeiro
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

      <SimplePdfViewer
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        pdfUrl={pdfUrl}
        title="Visualização da Conta de Energia"
        allowDownload={true}
      />
    </>
  );
}


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
        .from("faturas")
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
        .from("faturas")
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

      <PdfPreview
        isOpen={showPdfPreview}
        onClose={handleClosePdfPreview}
        pdfUrl={pdfUrl}
      />
    </>
  );
}


/**
 * Linha da tabela de faturas para desktop
 * 
 * Este componente exibe uma linha na tabela de faturas com os dados
 * de uma fatura e as ações disponíveis. A data de próxima leitura
 * mostra a leitura programada que foi cadastrada no mês anterior.
 * Inclui mais informações sobre o cooperado e a unidade beneficiária.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import { TableCell, TableRow } from "@/components/ui/table";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { useState } from "react";
import { FaturaActionsMenu } from "../FaturaActionsMenu";
import { FileText, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfPreview } from "../../upload/PdfPreview";
import { toast } from "sonner";
import { STORAGE_BUCKET } from "../../upload/constants";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { StatusTransitionButtons } from "../../StatusTransitionButtons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowDown } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatarDocumento } from "@/utils/formatters";

interface FaturaDesktopRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onShowPaymentConfirmation: (fatura: Fatura) => void;
  // A propriedade onViewPdf é opcional agora
  onViewPdf?: (fatura: Fatura) => void;
}

export function FaturaDesktopRow({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onShowPaymentConfirmation,
  // Definimos um valor padrão para onViewPdf usando uma função vazia
  onViewPdf = () => {}
}: FaturaDesktopRowProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showCooperadoInfo, setShowCooperadoInfo] = useState(false);

  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleViewArquivoConcessionaria = () => {
    if (!fatura.arquivo_concessionaria_path) {
      toast.error("Nenhum arquivo de fatura disponível");
      return;
    }
    
    console.log("[FaturaDesktopRow] Abrindo visualização da fatura:", fatura.arquivo_concessionaria_path);
    console.log("[FaturaDesktopRow] Bucket utilizado:", STORAGE_BUCKET);
    setShowPdfPreview(true);
  };

  // Formato de exibição do cliente - nome (documento)
  const clienteDisplay = fatura.unidade_beneficiaria.cooperado.documento ? 
    `${fatura.unidade_beneficiaria.cooperado.nome} (${formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)})` : 
    fatura.unidade_beneficiaria.cooperado.nome;

  return (
    <>
      <TableRow key={fatura.id} className="h-9 hover:bg-gray-50">
        <TableCell className="py-1.5 px-3 text-sm">{fatura.unidade_beneficiaria.numero_uc}</TableCell>
        <TableCell className="py-1.5 px-3 text-sm font-medium truncate max-w-[180px]">
          <div className="flex items-center space-x-1">
            <span className="truncate">{clienteDisplay}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setShowCooperadoInfo(!showCooperadoInfo)}>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-80">
                  <div className="space-y-2">
                    <p className="font-medium">{fatura.unidade_beneficiaria.cooperado.nome}</p>
                    {fatura.unidade_beneficiaria.cooperado.documento && (
                      <p className="text-sm">Documento: {formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}</p>
                    )}
                    {fatura.unidade_beneficiaria.cooperado.telefone && (
                      <p className="text-sm">Telefone: {fatura.unidade_beneficiaria.cooperado.telefone}</p>
                    )}
                    {fatura.unidade_beneficiaria.cooperado.email && (
                      <p className="text-sm">Email: {fatura.unidade_beneficiaria.cooperado.email}</p>
                    )}
                    <p className="text-sm">Unidade: {fatura.unidade_beneficiaria.numero_uc}</p>
                    {fatura.unidade_beneficiaria.apelido && (
                      <p className="text-sm">Apelido: {fatura.unidade_beneficiaria.apelido}</p>
                    )}
                    <p className="text-sm">Endereço: {fatura.unidade_beneficiaria.endereco}</p>
                    <p className="text-xs text-muted-foreground">Desconto: {fatura.unidade_beneficiaria.percentual_desconto}%</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-right">
          {fatura.consumo_kwh || 0} kWh
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-right">
          {formatCurrency(fatura.valor_assinatura || 0)}
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-right">
          {formatDateToPtBR(fatura.data_vencimento)}
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
        <TableCell className="py-1.5 px-3 text-sm text-center">
          {fatura.data_proxima_leitura ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center text-green-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDateToPtBR(fatura.data_proxima_leitura)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Leitura programada para esta data</p>
                  <p className="text-xs text-gray-500">Esta data foi programada no mês anterior</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span className="text-xs text-gray-400">Não agendada</span>
          )}
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 w-full flex justify-between items-center">
                Ações <ArrowDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-fit" align="end">
              <StatusTransitionButtons 
                fatura={fatura} 
                onUpdateStatus={onUpdateStatus} 
                size="sm"
                direction="column"
                className="w-full"
              />
            </PopoverContent>
          </Popover>
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm w-10">
          <FaturaActionsMenu
            fatura={fatura}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            onShowPaymentModal={() => onShowPaymentConfirmation(fatura)}
          />
        </TableCell>
      </TableRow>

      <PdfPreview
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        pdfUrl={fatura.arquivo_concessionaria_path}
        title="Visualização da Conta de Energia"
        bucketName={STORAGE_BUCKET} // Passando o nome do bucket explicitamente
      />
    </>
  );
}


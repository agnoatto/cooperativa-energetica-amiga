
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Fatura } from "@/types/fatura";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { formatarDocumento } from "@/utils/formatters";
import { FileText } from "lucide-react";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { FaturaRowActions } from "../FaturaRowActions";

interface FaturaDesktopRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: string, observacao?: string) => Promise<void>;
  onShowPaymentModal: () => void;
  onViewPdf: () => void;
  onCriarCobranca?: (fatura: Fatura) => void; // Adicionando essa propriedade opcional
}

export function FaturaDesktopRow({
  fatura,
  onViewDetails,
  onDelete,
  onUpdateStatus,
  onShowPaymentModal,
  onViewPdf,
  onCriarCobranca // Adicionando esse parâmetro
}: FaturaDesktopRowProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <TableRow className="border-b hover:bg-gray-50 transition-colors">
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {fatura.unidade_beneficiaria.cooperado.nome}
          </span>
          <div className="text-sm text-gray-500 space-x-2">
            <span>{formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}</span>
            <span>•</span>
            <span>
              UC: {fatura.unidade_beneficiaria.numero_uc}
              {fatura.unidade_beneficiaria.apelido && (
                <span className="text-gray-400 ml-1">
                  ({fatura.unidade_beneficiaria.apelido})
                </span>
              )}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">{formatDateToPtBR(fatura.data_vencimento)}</TableCell>
      <TableCell className="text-right font-mono whitespace-nowrap">{fatura.consumo_kwh} kWh</TableCell>
      <TableCell className="text-right font-mono whitespace-nowrap">{formatCurrency(fatura.total_fatura)}</TableCell>
      <TableCell className="text-right font-mono whitespace-nowrap">{formatCurrency(fatura.fatura_concessionaria)}</TableCell>
      <TableCell className="text-right font-mono whitespace-nowrap">{fatura.unidade_beneficiaria.percentual_desconto}%</TableCell>
      <TableCell className="text-right font-mono whitespace-nowrap">{formatCurrency(fatura.valor_desconto)}</TableCell>
      <TableCell className="text-right font-mono whitespace-nowrap">
        {formatCurrency(fatura.valor_assinatura)}
        {fatura.valor_adicional > 0 && (
          <span className="text-yellow-600 text-sm block">
            +{formatCurrency(fatura.valor_adicional)}
          </span>
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <FaturaStatusBadge fatura={fatura} />
      </TableCell>
      <TableCell className="whitespace-nowrap text-center">
        {fatura.arquivo_concessionaria_path ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onViewPdf}
            title="Visualizar conta de energia"
            className="h-8 w-8"
          >
            <FileText className="h-4 w-4" />
          </Button>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )}
      </TableCell>
      <TableCell className="text-right whitespace-nowrap">
        <FaturaRowActions
          fatura={fatura}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
          onCriarCobranca={onCriarCobranca} // Passando para o FaturaRowActions em vez de onEdit
        />
      </TableCell>
    </TableRow>
  );
}

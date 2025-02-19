
import { Button } from "@/components/ui/button";
import { Fatura } from "@/types/fatura";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { formatarDocumento } from "@/utils/formatters";
import { FileText, ChevronRight } from "lucide-react";
import { FaturaStatusBadge } from "../FaturaStatusBadge";

interface FaturaMobileCardProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onViewPdf: () => void;
}

export function FaturaMobileCard({ fatura, onViewDetails, onViewPdf }: FaturaMobileCardProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 touch-manipulation"
      onClick={() => onViewDetails(fatura)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 truncate">
            {fatura.unidade_beneficiaria.cooperado.nome}
          </h3>
          <p className="text-sm text-gray-500">
            {formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}
          </p>
        </div>
        <FaturaStatusBadge fatura={fatura} />
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
        <div className="text-gray-500">UC:</div>
        <div className="text-right">{fatura.unidade_beneficiaria.numero_uc}</div>
        
        <div className="text-gray-500">Vencimento:</div>
        <div className="text-right">{formatDateToPtBR(fatura.data_vencimento)}</div>
        
        <div className="text-gray-500">Valor:</div>
        <div className="text-right font-medium">{formatCurrency(fatura.valor_assinatura)}</div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex gap-2">
          {fatura.arquivo_concessionaria_path && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewPdf();
              }}
              className="p-2"
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}

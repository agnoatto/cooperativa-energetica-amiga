
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, FileText } from "lucide-react";
import { formatDateToPtBR } from "@/utils/dateFormatters";

interface FaturaMobileCardProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onViewPdf: () => void;
}

export function FaturaMobileCard({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onViewPdf
}: FaturaMobileCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">UC: {fatura.unidade_beneficiaria.numero_uc}</h3>
            <p className="text-sm text-gray-500">{fatura.unidade_beneficiaria.cooperado.nome}</p>
          </div>
          <FaturaStatusBadge fatura={fatura} />
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Consumo:</p>
            <p className="font-medium">{fatura.consumo_kwh || 0} kWh</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Valor:</p>
            <p className="font-medium">{formatCurrency(fatura.valor_assinatura || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Vencimento:</p>
            <p className="font-medium">{formatDateToPtBR(fatura.data_vencimento)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fatura:</p>
            <p className="font-medium">{formatCurrency(fatura.total_fatura || 0)}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewDetails(fatura)}
        >
          <Eye className="mr-1 h-4 w-4" />
          Detalhes
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(fatura)}
        >
          <Edit className="mr-1 h-4 w-4" />
          Editar
        </Button>
        
        {fatura.arquivo_concessionaria_path && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewPdf}
          >
            <FileText className="mr-1 h-4 w-4" />
            Ver PDF
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

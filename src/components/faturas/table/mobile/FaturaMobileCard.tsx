
/**
 * Card de fatura para mobile
 * 
 * Este componente exibe os dados de uma fatura em formato de card,
 * otimizado para visualização em dispositivos móveis.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, FileText, CheckCircle } from "lucide-react";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { StatusTransitionButtons } from "../../StatusTransitionButtons";

interface FaturaMobileCardProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onViewPdf: () => void;
  onShowPaymentConfirmation: (fatura: Fatura) => void;
}

export function FaturaMobileCard({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onViewPdf,
  onShowPaymentConfirmation
}: FaturaMobileCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Verificar se a fatura está em um status que permite confirmar pagamento
  const canConfirmPayment = ['enviada', 'reenviada', 'atrasada'].includes(fatura.status);

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
        
        {/* Botões de alteração de status */}
        <div className="mt-3">
          <StatusTransitionButtons 
            fatura={fatura} 
            onUpdateStatus={onUpdateStatus} 
            size="sm"
          />
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t flex flex-wrap justify-end gap-2">
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
        
        {canConfirmPayment && (
          <Button 
            variant="outline" 
            size="sm"
            className="border-green-300 bg-green-50 text-green-900 hover:bg-green-100"
            onClick={() => onShowPaymentConfirmation(fatura)}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Confirmar Pagamento
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

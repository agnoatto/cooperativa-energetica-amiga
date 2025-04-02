
/**
 * Card de fatura para visualização mobile
 * 
 * Este componente exibe as informações de uma fatura em formato de card,
 * otimizado para visualização em dispositivos móveis. É composto por
 * subcomponentes menores para facilitar manutenção.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaturaCardHeader } from "./components/FaturaCardHeader";
import { FaturaCooperadoInfo } from "./components/FaturaCooperadoInfo";
import { FaturaValoresInfo } from "./components/FaturaValoresInfo";
import { FaturaCardActions } from "./components/FaturaCardActions";
import { User } from "lucide-react";

interface FaturaMobileCardProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onViewPdf: (fatura: Fatura) => void;
}

export function FaturaMobileCard({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onViewPdf
}: FaturaMobileCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 py-3 px-4">
        <FaturaCardHeader fatura={fatura} />
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-500 mr-2" />
            <FaturaCooperadoInfo fatura={fatura} />
          </div>
          
          <Separator className="my-1" />
          
          <FaturaValoresInfo fatura={fatura} onViewPdf={onViewPdf} />
        </div>
      </CardContent>
      
      <CardFooter className="p-0 border-t">
        <FaturaCardActions 
          fatura={fatura}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
        />
      </CardFooter>
    </Card>
  );
}

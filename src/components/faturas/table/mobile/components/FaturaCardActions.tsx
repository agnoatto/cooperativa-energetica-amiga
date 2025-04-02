
/**
 * Componente de ações do card de fatura
 * 
 * Gerencia as ações disponíveis para a fatura, como transições de status
 * e ações de edição, com estados expansíveis para melhorar a experiência mobile.
 */
import { useState } from "react";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Button } from "@/components/ui/button";
import { FaturaActionsMenu } from "../../FaturaActionsMenu";
import { StatusTransitionButtons } from "@/components/faturas/StatusTransitionButtons";

interface FaturaCardActionsProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturaCardActions({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus
}: FaturaCardActionsProps) {
  const [expandActions, setExpandActions] = useState(false);
  
  return (
    <div className="w-full">
      {expandActions ? (
        <div className="p-3 space-y-2">
          <StatusTransitionButtons 
            fatura={fatura} 
            onUpdateStatus={onUpdateStatus}
            size="sm"
            direction="column"
            className="w-full"
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => setExpandActions(false)}
          >
            Mostrar menos
          </Button>
        </div>
      ) : (
        <div className="p-3 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandActions(true)}
          >
            Ações de Status
          </Button>
          
          <div className="flex gap-2">
            <FaturaActionsMenu
              fatura={fatura}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
            />
          </div>
        </div>
      )}
    </div>
  );
}

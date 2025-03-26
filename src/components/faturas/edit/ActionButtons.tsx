
/**
 * Botões de ação do formulário de edição de faturas
 * 
 * Exibe os botões para salvar ou cancelar a edição de uma fatura.
 * Implementa o modo desabilitado quando a fatura está em status que não permite edição.
 */
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionButtonsProps {
  onClose: () => void;
  isProcessing: boolean;
  disabled?: boolean;
  disabledMessage?: string;
}

export function ActionButtons({
  onClose, 
  isProcessing,
  disabled = false,
  disabledMessage
}: ActionButtonsProps) {
  const saveButton = (
    <Button 
      type="submit" 
      disabled={isProcessing || disabled}
      className="ml-auto"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Salvando...
        </>
      ) : (
        "Salvar"
      )}
    </Button>
  );

  return (
    <div className="flex justify-end mt-6 space-x-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
        disabled={isProcessing}
      >
        Cancelar
      </Button>
      
      {disabled && disabledMessage ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {saveButton}
            </TooltipTrigger>
            <TooltipContent>
              <p>{disabledMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        saveButton
      )}
    </div>
  );
}

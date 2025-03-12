
/**
 * Componente de botões para o formulário de edição de pagamentos
 * 
 * Exibe os botões de cancelar e salvar, controlando o estado de carregamento
 * durante a submissão do formulário.
 */
import { Button } from "@/components/ui/button";

interface FormButtonsProps {
  onClose: () => void;
  isSaving: boolean;
}

export function FormButtons({ onClose, isSaving }: FormButtonsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
}

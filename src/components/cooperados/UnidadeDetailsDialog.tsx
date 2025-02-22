
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatarKwh } from "@/utils/formatters";

interface UnidadeDetailsDialogProps {
  unidade: any;
  isOpen: boolean;
  onClose: () => void;
}

export function UnidadeDetailsDialog({ unidade, isOpen, onClose }: UnidadeDetailsDialogProps) {
  if (!unidade) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Unidade</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número UC</p>
              <p className="text-base">{unidade.numero_uc}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Apelido</p>
              <p className="text-base">{unidade.apelido || '-'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Endereço</p>
            <p className="text-base">{unidade.endereco}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Desconto</p>
              <p className="text-base">{unidade.percentual_desconto}%</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Consumo</p>
              <p className="text-base">{formatarKwh(unidade.consumo_kwh)} kWh</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Entrada</p>
              <p className="text-base">{formatDate(unidade.data_entrada)}</p>
            </div>
            
            {unidade.data_saida && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Saída</p>
                <p className="text-base">{formatDate(unidade.data_saida)}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

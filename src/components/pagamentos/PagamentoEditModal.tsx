
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PagamentoData } from "./types/pagamento";
import { usePagamentoForm } from "./hooks/usePagamentoForm";
import { PagamentoFormFields } from "./PagamentoFormFields";
import { formatarMoeda } from "@/utils/formatters";

interface PagamentoEditModalProps {
  pagamento: PagamentoData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function PagamentoEditModal({
  pagamento,
  isOpen,
  onClose,
  onSave,
}: PagamentoEditModalProps) {
  const {
    form,
    setForm,
    valorKwh,
    valorBruto,
    valorTotalTusdFioB,
    valorEfetivo,
    handleSubmit,
  } = usePagamentoForm(pagamento, onSave, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {pagamento ? 'Editar Pagamento' : 'Novo Pagamento'}
          </DialogTitle>
        </DialogHeader>

        {pagamento && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Investidor</p>
              <p className="font-medium">{pagamento.usina?.investidor?.nome_investidor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nº UC</p>
              <p className="font-medium">{pagamento.usina?.unidade_usina?.numero_uc}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor kWh</p>
              <p className="font-medium">{formatarMoeda(pagamento.usina?.valor_kwh || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Geração Total</p>
              <p className="font-medium">{pagamento.geracao_kwh} kWh</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <PagamentoFormFields
            form={form}
            setForm={setForm}
            valorKwh={valorKwh}
            valorBruto={valorBruto}
            valorTotalTusdFioB={valorTotalTusdFioB}
            valorEfetivo={valorEfetivo}
            pagamentoId={pagamento?.id || ''}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

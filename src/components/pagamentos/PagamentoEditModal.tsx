
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PagamentoData } from "./types/pagamento";
import { usePagamentoForm } from "./hooks/usePagamentoForm";
import { PagamentoFormFields } from "./PagamentoFormFields";

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

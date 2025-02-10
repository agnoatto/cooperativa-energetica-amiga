
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePagamentoForm } from "./hooks/usePagamentoForm";
import { PagamentoFormFields } from "./PagamentoFormFields";

interface PagamentoEditModalProps {
  pagamento: {
    id: string;
    geracao_kwh: number;
    valor_total: number;
    status: string;
    data_pagamento: string | null;
    tusd_fio_b: number;
    valor_concessionaria: number;
    usina: {
      valor_kwh: number;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function PagamentoEditModal({ pagamento, isOpen, onClose, onSave }: PagamentoEditModalProps) {
  const {
    form,
    setForm,
    valorKwh,
    valorBruto,
    valorEfetivo,
    handleSubmit,
  } = usePagamentoForm(pagamento, onSave, onClose);

  if (!pagamento) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PagamentoFormFields
            form={form}
            setForm={setForm}
            valorKwh={valorKwh}
            valorBruto={valorBruto}
            valorEfetivo={valorEfetivo}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

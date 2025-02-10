
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePagamentoForm } from "./hooks/usePagamentoForm";
import { PagamentoFormFields } from "./PagamentoFormFields";

interface PagamentoEditModalProps {
  pagamento: {
    id: string;
    geracao_kwh: number;
    valor_tusd_fio_b: number;
    conta_energia: number;
    valor_total: number;
    status: string;
    data_vencimento: string;
    data_pagamento: string | null;
    usina: {
      id: string;
      valor_kwh: number;
      unidade_usina: {
        numero_uc: string;
      };
      investidor: {
        nome_investidor: string;
      };
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
    valorKwhEfetivo,
    valorBruto,
    handleSubmit,
    parseCurrencyToNumber
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
            valorKwhEfetivo={valorKwhEfetivo}
            valorBruto={valorBruto}
            parseCurrencyToNumber={parseCurrencyToNumber}
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

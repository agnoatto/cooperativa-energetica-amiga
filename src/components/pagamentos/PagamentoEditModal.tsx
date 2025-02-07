
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function PagamentoEditModal({ pagamento, isOpen, onClose, onSave }: PagamentoEditModalProps) {
  const [form, setForm] = useState(pagamento || {
    geracao_kwh: 0,
    valor_tusd_fio_b: 0,
    conta_energia: 0,
    valor_total: 0,
    status: 'pendente',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('pagamentos_usina')
        .update({
          geracao_kwh: Number(form.geracao_kwh),
          valor_tusd_fio_b: Number(form.valor_tusd_fio_b),
          conta_energia: Number(form.conta_energia),
          valor_total: Number(form.valor_total),
          status: form.status,
          data_pagamento: form.status === 'pago' ? new Date().toISOString().split('T')[0] : null,
        })
        .eq('id', pagamento?.id);

      if (error) throw error;

      toast.success('Pagamento atualizado com sucesso!');
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error);
      toast.error('Erro ao atualizar pagamento');
    }
  };

  if (!pagamento) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="geracao_kwh">Geração (kWh)</Label>
            <Input
              id="geracao_kwh"
              type="number"
              value={form.geracao_kwh}
              onChange={(e) => setForm({ ...form, geracao_kwh: e.target.valueAsNumber })}
            />
          </div>
          <div>
            <Label htmlFor="valor_tusd_fio_b">TUSD Fio B</Label>
            <Input
              id="valor_tusd_fio_b"
              type="number"
              value={form.valor_tusd_fio_b}
              onChange={(e) => setForm({ ...form, valor_tusd_fio_b: e.target.valueAsNumber })}
            />
          </div>
          <div>
            <Label htmlFor="conta_energia">Conta de Energia</Label>
            <Input
              id="conta_energia"
              type="number"
              value={form.conta_energia}
              onChange={(e) => setForm({ ...form, conta_energia: e.target.valueAsNumber })}
            />
          </div>
          <div>
            <Label htmlFor="valor_total">Valor Total</Label>
            <Input
              id="valor_total"
              type="number"
              value={form.valor_total}
              onChange={(e) => setForm({ ...form, valor_total: e.target.valueAsNumber })}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

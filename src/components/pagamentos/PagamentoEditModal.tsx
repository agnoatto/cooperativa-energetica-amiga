
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CurrencyInput } from "@/components/faturas/CurrencyInput";
import { Input } from "@/components/ui/input";

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
    usina_id: string;
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
    data_pagamento: null,
  });

  const [valorKwh, setValorKwh] = useState<number>(0);
  const [valorKwhEfetivo, setValorKwhEfetivo] = useState<number>(0);
  const [valorBruto, setValorBruto] = useState<number>(0);

  // Buscar valor_kwh da usina
  useEffect(() => {
    if (pagamento?.usina_id) {
      const fetchValorKwh = async () => {
        const { data, error } = await supabase
          .from('usinas')
          .select('valor_kwh')
          .eq('id', pagamento.usina_id)
          .single();

        if (error) {
          console.error('Erro ao buscar valor_kwh:', error);
          toast.error('Erro ao buscar valor do kWh da usina');
          return;
        }

        if (data) {
          setValorKwh(data.valor_kwh);
        }
      };

      fetchValorKwh();
    }
  }, [pagamento?.usina_id]);

  // Função para converter valor em string formatado para número
  const parseCurrencyToNumber = (value: string): number => {
    return Number(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  // Calcular valor efetivo do kWh
  useEffect(() => {
    const tusdFioB = parseCurrencyToNumber(form.valor_tusd_fio_b.toString());
    const valorEfetivo = valorKwh - tusdFioB;
    setValorKwhEfetivo(valorEfetivo);
  }, [valorKwh, form.valor_tusd_fio_b]);

  // Calcular valor bruto
  useEffect(() => {
    const valorBrutoCalculado = form.geracao_kwh * valorKwhEfetivo;
    setValorBruto(valorBrutoCalculado);
  }, [form.geracao_kwh, valorKwhEfetivo]);

  // Calcular valor total líquido
  useEffect(() => {
    const contaEnergia = parseCurrencyToNumber(form.conta_energia.toString());
    const valorTotal = valorBruto - contaEnergia;
    setForm(prev => ({ ...prev, valor_total: valorTotal }));
  }, [valorBruto, form.conta_energia]);

  // Atualizar data de pagamento quando status mudar para 'pago'
  useEffect(() => {
    if (form.status === 'pago' && !form.data_pagamento) {
      setForm(prev => ({
        ...prev,
        data_pagamento: new Date().toISOString().split('T')[0]
      }));
    }
  }, [form.status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('pagamentos_usina')
        .update({
          geracao_kwh: Number(form.geracao_kwh),
          valor_tusd_fio_b: parseCurrencyToNumber(form.valor_tusd_fio_b.toString()),
          conta_energia: parseCurrencyToNumber(form.conta_energia.toString()),
          valor_total: form.valor_total,
          status: form.status,
          data_pagamento: form.data_pagamento,
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
              onChange={(e) => setForm({ ...form, geracao_kwh: e.target.valueAsNumber || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="valor_kwh">Valor do kWh (R$)</Label>
            <Input
              id="valor_kwh"
              type="text"
              value={valorKwh.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="valor_tusd_fio_b">TUSD Fio B (R$/kWh)</Label>
            <CurrencyInput
              id="valor_tusd_fio_b"
              value={form.valor_tusd_fio_b}
              onChange={(value) => setForm({ ...form, valor_tusd_fio_b: parseCurrencyToNumber(value) })}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="valor_kwh_efetivo">Valor kWh Efetivo (R$)</Label>
            <Input
              id="valor_kwh_efetivo"
              type="text"
              value={valorKwhEfetivo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="valor_bruto">Valor Bruto a Receber (R$)</Label>
            <Input
              id="valor_bruto"
              type="text"
              value={valorBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="conta_energia">Conta de Energia (R$)</Label>
            <CurrencyInput
              id="conta_energia"
              value={form.conta_energia}
              onChange={(value) => setForm({ ...form, conta_energia: parseCurrencyToNumber(value) })}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="valor_total">Valor Total Líquido</Label>
            <CurrencyInput
              id="valor_total"
              value={form.valor_total}
              onChange={() => {}} // Somente leitura
              className="w-full bg-gray-100"
              readOnly
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

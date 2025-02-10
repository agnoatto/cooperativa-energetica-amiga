
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PagamentoFormData {
  id?: string;
  geracao_kwh: number;
  valor_tusd_fio_b: number;
  conta_energia: number;
  valor_total: number;
  status: string;
  data_pagamento: string | null;
  usina_id?: string;
  data_vencimento?: string;
}

export function usePagamentoForm(pagamento: PagamentoFormData | null, onSave: () => void, onClose: () => void) {
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

  return {
    form,
    setForm,
    valorKwh,
    valorKwhEfetivo,
    valorBruto,
    handleSubmit,
    parseCurrencyToNumber
  };
}

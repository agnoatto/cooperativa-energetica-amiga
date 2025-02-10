
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PagamentoFormData {
  id?: string;
  geracao_kwh: number;
  valor_total: number;
  status: string;
  data_pagamento: string | null;
  tusd_fio_b: number | null;
  valor_tusd_fio_b: number | null;
  valor_concessionaria: number;
  usina: {
    valor_kwh: number;
  };
}

export function usePagamentoForm(pagamento: PagamentoFormData | null, onSave: () => void, onClose: () => void) {
  const [form, setForm] = useState({
    geracao_kwh: pagamento?.geracao_kwh || 0,
    valor_total: pagamento?.valor_total || 0,
    status: pagamento?.status || 'pendente',
    data_pagamento: pagamento?.data_pagamento || null,
    tusd_fio_b: pagamento?.valor_tusd_fio_b || pagamento?.tusd_fio_b || 0,
    valor_concessionaria: pagamento?.valor_concessionaria || 0,
  });

  // Valor do kWh vindo da usina
  const valorKwh = pagamento?.usina?.valor_kwh || 0;

  // Valor bruto calculado ((valor do kWh - TUSD Fio B) * geração)
  const valorBruto = (valorKwh - form.tusd_fio_b) * form.geracao_kwh;

  // Valor efetivo (valor bruto - valor da concessionária)
  const valorEfetivo = valorBruto - form.valor_concessionaria;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('pagamentos_usina')
        .update({
          geracao_kwh: Number(form.geracao_kwh),
          valor_total: valorEfetivo,
          status: form.status,
          data_pagamento: form.data_pagamento,
          valor_tusd_fio_b: Number(form.tusd_fio_b),
          valor_concessionaria: Number(form.valor_concessionaria),
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
    valorBruto,
    valorEfetivo,
    handleSubmit
  };
}

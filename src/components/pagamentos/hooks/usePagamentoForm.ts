
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PagamentoFormData {
  id?: string;
  geracao_kwh: number;
  valor_total: number;
  status: string;
  data_pagamento: string | null;
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
  });

  // Valor do kWh vindo da usina
  const valorKwh = pagamento?.usina?.valor_kwh || 0;

  // Valor bruto calculado (geração * valor do kWh)
  const valorBruto = form.geracao_kwh * valorKwh;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('pagamentos_usina')
        .update({
          geracao_kwh: Number(form.geracao_kwh),
          valor_total: valorBruto,
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
    valorBruto,
    handleSubmit
  };
}

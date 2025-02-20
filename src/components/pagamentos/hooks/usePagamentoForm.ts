
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PagamentoData, PagamentoFormValues } from "../types/pagamento";

export function usePagamentoForm(pagamento: PagamentoData | null, onSave: () => void, onClose: () => void) {
  const [form, setForm] = useState<PagamentoFormValues>({
    geracao_kwh: 0,
    valor_total: 0,
    status: 'pendente',
    data_pagamento: null,
    data_emissao: null,
    tusd_fio_b: 0,
    valor_concessionaria: 0,
    data_vencimento_concessionaria: null,
    observacao: '',
    observacao_pagamento: '',
    arquivo_comprovante_nome: null,
    arquivo_comprovante_path: null
  });

  // Initialize form when pagamento changes
  useEffect(() => {
    if (pagamento) {
      setForm({
        geracao_kwh: pagamento.geracao_kwh || 0,
        valor_total: pagamento.valor_total || 0,
        status: pagamento.status || 'pendente',
        data_pagamento: pagamento.data_pagamento,
        data_emissao: pagamento.data_emissao,
        tusd_fio_b: pagamento.tusd_fio_b || 0,
        valor_concessionaria: pagamento.valor_concessionaria || 0,
        data_vencimento_concessionaria: pagamento.data_vencimento_concessionaria,
        observacao: pagamento.observacao || '',
        observacao_pagamento: pagamento.observacao_pagamento || '',
        arquivo_comprovante_nome: pagamento.arquivo_comprovante_nome,
        arquivo_comprovante_path: pagamento.arquivo_comprovante_path
      });
    }
  }, [pagamento]);

  // Valor do kWh vindo da usina
  const valorKwh = pagamento?.usina?.valor_kwh || 0;

  // Valor total do TUSD Fio B (TUSD Fio B unitário * geração)
  const valorTotalTusdFioB = form.tusd_fio_b * form.geracao_kwh;

  // Valor bruto calculado (valorKwh * geração)
  const valorBruto = valorKwh * form.geracao_kwh;

  // Valor efetivo (valor bruto - valor TUSD Fio B - valor da concessionária)
  const valorEfetivo = valorBruto - valorTotalTusdFioB - form.valor_concessionaria;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pagamento?.id) {
      toast.error('ID do pagamento não encontrado');
      return;
    }

    try {
      const { error } = await supabase
        .from('pagamentos_usina')
        .update({
          geracao_kwh: Number(form.geracao_kwh),
          valor_total: Number(valorEfetivo.toFixed(4)),
          status: form.status,
          data_pagamento: form.data_pagamento,
          data_emissao: form.data_emissao,
          tusd_fio_b: Number(form.tusd_fio_b.toFixed(4)),
          valor_tusd_fio_b: Number(valorTotalTusdFioB.toFixed(4)),
          valor_concessionaria: Number(form.valor_concessionaria.toFixed(4)),
          data_vencimento_concessionaria: form.data_vencimento_concessionaria,
          observacao: form.observacao || null,
          observacao_pagamento: form.observacao_pagamento || null,
          arquivo_comprovante_nome: form.arquivo_comprovante_nome,
          arquivo_comprovante_path: form.arquivo_comprovante_path
        })
        .eq('id', pagamento.id);

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
    valorTotalTusdFioB,
    valorEfetivo,
    handleSubmit
  };
}

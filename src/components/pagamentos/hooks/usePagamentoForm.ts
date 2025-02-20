
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PagamentoData, PagamentoFormValues } from "../types/pagamento";

export function usePagamentoForm(
  pagamento: PagamentoData | null,
  onSave: () => void,
  onClose: () => void
) {
  const [form, setForm] = useState<PagamentoFormValues>(() => {
    if (pagamento) {
      return {
        usina_id: pagamento.usina_id,
        mes: pagamento.mes,
        ano: pagamento.ano,
        geracao_kwh: pagamento.geracao_kwh,
        tusd_fio_b: pagamento.tusd_fio_b,
        valor_tusd_fio_b: pagamento.valor_tusd_fio_b,
        valor_concessionaria: pagamento.valor_concessionaria,
        valor_total: pagamento.valor_total,
        data_emissao: pagamento.data_emissao,
        data_vencimento: pagamento.data_vencimento,
        data_vencimento_concessionaria: pagamento.data_vencimento_concessionaria,
        data_pagamento: pagamento.data_pagamento,
        data_confirmacao: pagamento.data_confirmacao,
        data_envio: pagamento.data_envio,
        status: pagamento.status,
        observacao: pagamento.observacao,
        observacao_pagamento: pagamento.observacao_pagamento,
        arquivo_conta_energia_nome: pagamento.arquivo_conta_energia_nome,
        arquivo_conta_energia_path: pagamento.arquivo_conta_energia_path,
        arquivo_conta_energia_tipo: pagamento.arquivo_conta_energia_tipo,
        arquivo_conta_energia_tamanho: pagamento.arquivo_conta_energia_tamanho,
        send_method: pagamento.send_method
      };
    }
    return {
      usina_id: "",
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
      geracao_kwh: 0,
      tusd_fio_b: 0,
      valor_tusd_fio_b: 0,
      valor_concessionaria: 0,
      valor_total: 0,
      data_emissao: null,
      data_vencimento: "",
      data_vencimento_concessionaria: null,
      data_pagamento: null,
      data_confirmacao: null,
      data_envio: null,
      status: "pendente",
      observacao: null,
      observacao_pagamento: null,
      arquivo_conta_energia_nome: null,
      arquivo_conta_energia_path: null,
      arquivo_conta_energia_tipo: null,
      arquivo_conta_energia_tamanho: null,
      send_method: null
    };
  });

  // Initialize form when pagamento changes
  useEffect(() => {
    if (pagamento) {
      console.log('[usePagamentoForm] Iniciando formulário com dados:', pagamento);
      setForm({
        usina_id: pagamento.usina_id,
        mes: pagamento.mes,
        ano: pagamento.ano,
        geracao_kwh: pagamento.geracao_kwh,
        tusd_fio_b: pagamento.tusd_fio_b,
        valor_tusd_fio_b: pagamento.valor_tusd_fio_b,
        valor_concessionaria: pagamento.valor_concessionaria,
        valor_total: pagamento.valor_total,
        data_emissao: pagamento.data_emissao,
        data_vencimento: pagamento.data_vencimento,
        data_vencimento_concessionaria: pagamento.data_vencimento_concessionaria,
        data_pagamento: pagamento.data_pagamento,
        data_confirmacao: pagamento.data_confirmacao,
        data_envio: pagamento.data_envio,
        status: pagamento.status,
        observacao: pagamento.observacao,
        observacao_pagamento: pagamento.observacao_pagamento,
        arquivo_conta_energia_nome: pagamento.arquivo_conta_energia_nome,
        arquivo_conta_energia_path: pagamento.arquivo_conta_energia_path,
        arquivo_conta_energia_tipo: pagamento.arquivo_conta_energia_tipo,
        arquivo_conta_energia_tamanho: pagamento.arquivo_conta_energia_tamanho,
        send_method: pagamento.send_method
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
      console.log('[usePagamentoForm] Atualizando pagamento:', {
        id: pagamento.id,
        formData: form
      });

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
          arquivo_conta_energia_nome: form.arquivo_conta_energia_nome,
          arquivo_conta_energia_path: form.arquivo_conta_energia_path
        })
        .eq('id', pagamento.id);

      if (error) throw error;

      console.log('[usePagamentoForm] Pagamento atualizado com sucesso');
      toast.success('Pagamento atualizado com sucesso!');
      onSave();
      onClose();
    } catch (error) {
      console.error('[usePagamentoForm] Erro ao atualizar pagamento:', error);
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

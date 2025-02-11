
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
    economia_mes: 0,
    economia_acumulada: 0,
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
        economia_mes: pagamento.economia_mes || 0,
        economia_acumulada: pagamento.economia_acumulada || 0,
      });
    }
  }, [pagamento]);

  // Valor do kWh vindo da usina
  const valorKwh = pagamento?.usina?.valor_kwh || 0;

  // Valor bruto calculado ((valor do kWh - TUSD Fio B) * geração)
  const valorBruto = (valorKwh - form.tusd_fio_b) * form.geracao_kwh;

  // Valor efetivo (valor bruto - valor da concessionária)
  const valorEfetivo = valorBruto - form.valor_concessionaria;

  // Economia do mês (diferença entre o valor que seria pago sem desconto e o valor efetivo)
  const economiaMes = Math.max(0, form.valor_concessionaria - valorEfetivo);

  // Função para buscar economia acumulada
  const fetchEconomiaAcumulada = async (mes: number, ano: number, usinaId?: string) => {
    if (!usinaId) return 0;

    const { data, error } = await supabase
      .from('pagamentos_usina')
      .select('economia_mes')
      .eq('usina_id', usinaId)
      .lt('ano', ano)
      .order('ano', { ascending: false })
      .order('mes', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Erro ao buscar economia acumulada:', error);
      return 0;
    }

    const economiaAnterior = data?.[0]?.economia_acumulada || 0;
    return economiaAnterior + economiaMes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pagamento?.id) {
      toast.error('ID do pagamento não encontrado');
      return;
    }

    if (!pagamento.usina?.id) {
      toast.error('ID da usina não encontrado');
      return;
    }

    try {
      // Atualiza a economia acumulada antes de salvar
      const economiaAcumulada = await fetchEconomiaAcumulada(
        pagamento.mes,
        pagamento.ano,
        pagamento.usina.id
      );

      const { error } = await supabase
        .from('pagamentos_usina')
        .update({
          geracao_kwh: Number(form.geracao_kwh),
          valor_total: valorEfetivo,
          status: form.status,
          data_pagamento: form.data_pagamento,
          data_emissao: form.data_emissao,
          tusd_fio_b: Number(form.tusd_fio_b),
          valor_concessionaria: Number(form.valor_concessionaria),
          economia_mes: economiaMes,
          economia_acumulada: economiaAcumulada,
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
    valorEfetivo,
    economiaMes,
    handleSubmit
  };
}


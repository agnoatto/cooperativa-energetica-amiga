
/**
 * Hook personalizado para gerenciar o formulário de edição de pagamentos
 * 
 * Este hook centraliza toda a lógica de estado e operações do formulário de
 * pagamentos, incluindo cálculos de valores e envio de dados ao servidor.
 */
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PagamentoData, PagamentoFormValues, PagamentoStatus } from "../types/pagamento";

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

  useEffect(() => {
    if (pagamento) {
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

  const valorKwh = pagamento?.usina?.valor_kwh || 0;
  const valorTotalTusdFioB = form.tusd_fio_b * form.geracao_kwh;
  const valorBruto = valorKwh * form.geracao_kwh;
  const valorEfetivo = valorBruto - valorTotalTusdFioB - form.valor_concessionaria;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pagamento?.id) {
      console.error('[usePagamentoForm] ID do pagamento não encontrado');
      toast.error('ID do pagamento não encontrado');
      return;
    }

    try {
      console.log('[usePagamentoForm] Iniciando atualização do pagamento:', {
        id: pagamento.id,
        formData: form,
        valorEfetivo: valorEfetivo
      });

      // Primeiro, buscar a cooperativa do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('cooperativa_id')
        .single();

      if (profileError) {
        console.error('[usePagamentoForm] Erro ao buscar perfil do usuário:', profileError);
        toast.error(`Erro ao buscar perfil: ${profileError.message}`);
        return;
      }

      if (!profile?.cooperativa_id) {
        console.error('[usePagamentoForm] Cooperativa não encontrada para o usuário');
        toast.error('Cooperativa não encontrada');
        return;
      }

      // Verificar se o status foi alterado
      const statusAtualizado = form.status !== pagamento.status;
      
      // Preparar histórico de status somente se houve mudança
      let historicoStatusUpdate = null;
      
      if (statusAtualizado && form.status) {
        console.log('[usePagamentoForm] Status atualizado:', {
          anterior: pagamento.status,
          novo: form.status
        });
        
        const novoHistoricoStatus = [
          ...(pagamento.historico_status || []),
          {
            data: new Date().toISOString(),
            status_anterior: pagamento.status,
            novo_status: form.status
          }
        ];
        
        historicoStatusUpdate = JSON.stringify(novoHistoricoStatus);
      }

      // Formatação adequada dos valores numéricos
      const dadosAtualizados: {
        status: PagamentoStatus | null;
        geracao_kwh: number;
        valor_total: number;
        tusd_fio_b: number;
        valor_tusd_fio_b: number;
        valor_concessionaria: number;
        data_vencimento: string | null;
        data_vencimento_concessionaria: string | null;
        data_emissao: string | null;
        data_pagamento: string | null;
        observacao: string | null;
        observacao_pagamento: string | null;
        arquivo_conta_energia_nome: string | null;
        arquivo_conta_energia_path: string | null;
        arquivo_conta_energia_tipo: string | null;
        arquivo_conta_energia_tamanho: number | null;
        cooperativa_id: string;
        historico_status?: string;
      } = {
        status: form.status,
        geracao_kwh: Number(form.geracao_kwh) || 0,
        valor_total: Number(valorEfetivo.toFixed(4)),
        tusd_fio_b: Number(form.tusd_fio_b) || 0,
        valor_tusd_fio_b: Number(valorTotalTusdFioB.toFixed(4)),
        valor_concessionaria: Number(form.valor_concessionaria) || 0,
        data_vencimento: form.data_vencimento || null,
        data_vencimento_concessionaria: form.data_vencimento_concessionaria,
        data_emissao: form.data_emissao,
        data_pagamento: form.data_pagamento,
        observacao: form.observacao || null,
        observacao_pagamento: form.observacao_pagamento || null,
        arquivo_conta_energia_nome: form.arquivo_conta_energia_nome,
        arquivo_conta_energia_path: form.arquivo_conta_energia_path,
        arquivo_conta_energia_tipo: form.arquivo_conta_energia_tipo,
        arquivo_conta_energia_tamanho: form.arquivo_conta_energia_tamanho,
        cooperativa_id: profile.cooperativa_id
      };

      // Se houver atualização no histórico de status, adicioná-lo
      if (historicoStatusUpdate) {
        dadosAtualizados.historico_status = historicoStatusUpdate;
      }

      console.log('[usePagamentoForm] Dados para atualização:', dadosAtualizados);

      // Realizar a atualização do pagamento
      const { data: updatedData, error } = await supabase
        .from('pagamentos_usina')
        .update(dadosAtualizados)
        .eq('id', pagamento.id)
        .select();

      if (error) {
        console.error('[usePagamentoForm] Erro ao atualizar pagamento:', error);
        
        // Verificar se o erro está relacionado a um trigger
        if (error.message.includes('violates trigger') || error.message.includes('atualizar_lancamento_pagamento_usina')) {
          console.error('[usePagamentoForm] Erro relacionado ao trigger de lançamentos financeiros');
          toast.error('Erro ao atualizar lançamentos financeiros associados. Tente novamente mais tarde.');
        } else {
          toast.error(`Erro ao atualizar pagamento: ${error.message}`);
        }
        return;
      }

      console.log('[usePagamentoForm] Pagamento atualizado com sucesso:', updatedData);
      toast.success('Pagamento atualizado com sucesso!');
      onSave();
      onClose();
    } catch (error: any) {
      console.error('[usePagamentoForm] Erro inesperado ao atualizar pagamento:', error);
      toast.error(`Erro inesperado: ${error.message}`);
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

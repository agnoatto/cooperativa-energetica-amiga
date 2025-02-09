
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateFaturaStatusInput } from "./types";
import { StatusHistoryEntry, FaturaStatus } from "@/types/fatura";

export const useUpdateFaturaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaStatusInput) => {
      console.log('Atualizando status da fatura:', data);
      const now = new Date().toISOString();
      
      // Buscar histórico atual
      const { data: fatura, error: fetchError } = await supabase
        .from("faturas")
        .select('historico_status')
        .eq('id', data.id)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar histórico da fatura:', fetchError);
        throw fetchError;
      }

      // Convert the raw JSON data to our type safely
      const historicoAtual = (fatura?.historico_status as Array<{
        status: FaturaStatus;
        data: string;
        observacao?: string;
      }> || []).map(entry => ({
        status: entry.status,
        data: entry.data,
        observacao: entry.observacao
      }));

      const novoHistorico: StatusHistoryEntry[] = [
        ...historicoAtual,
        {
          status: data.status,
          data: now,
          observacao: data.observacao
        }
      ];

      const updateData: Record<string, any> = {
        status: data.status,
        historico_status: novoHistorico
      };

      // Adicionar campos específicos baseados no status e dados de pagamento
      if (data.status === 'enviada') {
        updateData.data_envio = now;
      } else if (data.status === 'paga') {
        updateData.data_confirmacao_pagamento = now;
        if (data.data_pagamento) {
          updateData.data_pagamento = data.data_pagamento;
        }
        if (data.valor_adicional !== undefined) {
          updateData.valor_adicional = data.valor_adicional;
        }
        if (data.observacao_pagamento !== undefined) {
          updateData.observacao_pagamento = data.observacao_pagamento;
        }
      }

      console.log('Dados de atualização:', updateData);

      const { error: updateError } = await supabase
        .from("faturas")
        .update(updateData)
        .eq("id", data.id);

      if (updateError) {
        console.error('Erro ao atualizar fatura:', updateError);
        throw updateError;
      }

      console.log('Fatura atualizada com sucesso');
    },
    onMutate: async (data) => {
      toast.loading("Atualizando status da fatura...");
    },
    onSuccess: (_, variables) => {
      console.log('Mutation concluída com sucesso');
      const date = new Date();
      queryClient.invalidateQueries({
        queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
      });
      toast.success("Status da fatura atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar status da fatura:", error);
      toast.error("Erro ao atualizar status da fatura");
    },
  });
};

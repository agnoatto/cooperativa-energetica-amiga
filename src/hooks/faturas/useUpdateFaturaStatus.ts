
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

      // Adicionar campos específicos baseados no status
      if (data.status === 'enviada') {
        updateData.data_envio = now;
      } else if (data.status === 'paga') {
        updateData.data_confirmacao_pagamento = now;
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
      // Não retornamos nada (void) para corresponder ao tipo definido
    },
    onMutate: async (data) => {
      // Mostrar toast de loading
      toast.loading("Atualizando status da fatura...");
    },
    onSuccess: (_, variables) => {
      console.log('Mutation concluída com sucesso');
      // Invalidar a query das faturas para o mês atual
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

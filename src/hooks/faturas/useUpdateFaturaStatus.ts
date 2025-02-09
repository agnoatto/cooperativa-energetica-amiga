
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateFaturaStatusInput } from "./types";
import { StatusHistoryEntry, FaturaStatus } from "@/types/fatura";

export const useUpdateFaturaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaStatusInput) => {
      const now = new Date().toISOString();
      const { data: fatura } = await supabase
        .from("faturas")
        .select('historico_status')
        .eq('id', data.id)
        .single();

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

      const { error } = await supabase
        .from("faturas")
        .update(updateData)
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faturas"] });
      toast.success("Status da fatura atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar status da fatura:", error);
      toast.error("Erro ao atualizar status da fatura");
    },
  });
};

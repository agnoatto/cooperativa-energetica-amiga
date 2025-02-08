
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateFaturaStatusInput } from "./types";

export const useUpdateFaturaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaStatusInput) => {
      const now = new Date().toISOString();
      const updateData: Record<string, any> = {
        status: data.status,
        historico_status: supabase.sql`historico_status || ${JSON.stringify([{
          status: data.status,
          data: now,
          observacao: data.observacao
        }])}::jsonb`,
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

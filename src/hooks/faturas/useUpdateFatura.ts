
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateFaturaInput } from "./types";

export const useUpdateFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaInput) => {
      console.log('[useUpdateFatura] Iniciando atualização com dados:', data);
      
      // Cálculo direto dos valores derivados
      const valorDesconto = Number(data.total_fatura) * (data.percentual_desconto / 100);
      const valorAssinatura = Number(data.total_fatura) - valorDesconto;
      
      // Dados simples e diretos para atualização
      const faturaData = {
        consumo_kwh: Number(data.consumo_kwh),
        total_fatura: Number(data.total_fatura),
        fatura_concessionaria: Number(data.fatura_concessionaria),
        iluminacao_publica: Number(data.iluminacao_publica),
        outros_valores: Number(data.outros_valores),
        valor_desconto: valorDesconto,
        valor_assinatura: valorAssinatura,
        saldo_energia_kwh: Number(data.saldo_energia_kwh),
        observacao: data.observacao,
        data_vencimento: data.data_vencimento,
        data_atualizacao: new Date().toISOString(),
        arquivo_concessionaria_nome: data.arquivo_concessionaria_nome,
        arquivo_concessionaria_path: data.arquivo_concessionaria_path,
        arquivo_concessionaria_tipo: data.arquivo_concessionaria_tipo,
        arquivo_concessionaria_tamanho: data.arquivo_concessionaria_tamanho
      };
      
      console.log('[useUpdateFatura] Enviando dados ao Supabase:', faturaData);
      
      // Atualização direta no banco de dados
      const { error } = await supabase
        .from("faturas")
        .update(faturaData)
        .eq("id", data.id);
      
      if (error) {
        console.error('[useUpdateFatura] Erro do Supabase:', error);
        throw new Error(`Erro ao atualizar: ${error.message}`);
      }
      
      console.log('[useUpdateFatura] Atualização concluída com sucesso');
      return { id: data.id, ...faturaData };
    },
    
    onSuccess: () => {
      toast.success('Fatura atualizada com sucesso');
      // Atualização simples de cache
      queryClient.invalidateQueries({ queryKey: ['faturas'] });
    },
    
    onError: (error: Error) => {
      console.error('[useUpdateFatura] Erro na mutação:', error);
      toast.error(`Falha ao atualizar fatura: ${error.message}`);
    }
  });
};

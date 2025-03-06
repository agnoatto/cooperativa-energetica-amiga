
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateFaturaInput } from "./types";

export const useUpdateFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaInput) => {
      console.log('[useUpdateFatura] Iniciando atualização com dados:', data);
      
      // Garantindo que todos os valores numéricos sejam do tipo number
      const valorDesconto = Number(data.total_fatura) * (Number(data.percentual_desconto) / 100);
      const valorAssinatura = Number(data.total_fatura) - valorDesconto;
      
      // Dados para atualização - apenas os campos necessários
      // Garantindo que todos sejam números com parseFloat
      const faturaData = {
        consumo_kwh: Number(data.consumo_kwh),
        total_fatura: Number(data.total_fatura),
        fatura_concessionaria: Number(data.fatura_concessionaria),
        iluminacao_publica: Number(data.iluminacao_publica),
        outros_valores: Number(data.outros_valores),
        valor_desconto: parseFloat(valorDesconto.toFixed(2)),
        valor_assinatura: parseFloat(valorAssinatura.toFixed(2)),
        saldo_energia_kwh: Number(data.saldo_energia_kwh),
        observacao: data.observacao,
        data_vencimento: data.data_vencimento,
        data_atualizacao: new Date().toISOString(),
        arquivo_concessionaria_nome: data.arquivo_concessionaria_nome || null,
        arquivo_concessionaria_path: data.arquivo_concessionaria_path || null,
        arquivo_concessionaria_tipo: data.arquivo_concessionaria_tipo || null,
        arquivo_concessionaria_tamanho: data.arquivo_concessionaria_tamanho || null
      };
      
      console.log('[useUpdateFatura] Enviando dados simplificados ao Supabase:', faturaData);
      
      try {
        // Atualização direta e simplificada no banco de dados
        const { data: updatedData, error } = await supabase
          .from("faturas")
          .update(faturaData)
          .eq("id", data.id)
          .select("id")
          .single();
        
        if (error) {
          console.error('[useUpdateFatura] Erro do Supabase:', error);
          throw new Error(`Erro ao atualizar fatura: ${error.message}`);
        }
        
        console.log('[useUpdateFatura] Atualização concluída com sucesso, ID:', updatedData?.id);
        return { id: data.id, ...faturaData };
      } catch (error: any) {
        console.error('[useUpdateFatura] Erro durante a atualização:', error);
        throw new Error(`Erro ao atualizar fatura: ${error.message}`);
      }
    },
    
    onSuccess: () => {
      toast.success('Fatura atualizada com sucesso');
      // Invalidar cache de faturas para atualizar a interface
      queryClient.invalidateQueries({ queryKey: ['faturas'] });
    },
    
    onError: (error: Error) => {
      console.error('[useUpdateFatura] Erro na mutação:', error);
      toast.error(`Falha ao atualizar fatura: ${error.message}`);
    }
  });
};

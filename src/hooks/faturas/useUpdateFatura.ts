
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateFaturaInput } from "./types";

export const useUpdateFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaInput) => {
      console.log('[useUpdateFatura] Iniciando atualização com dados:', data);
      
      // Calcular os valores finais baseados nos dados recebidos
      // O cálculo é simplificado para economizar processamento
      const percentualDesconto = data.percentual_desconto / 100;
      const baseDesconto = Number(data.total_fatura) - Number(data.iluminacao_publica) - Number(data.outros_valores);
      const valorDesconto = parseFloat((baseDesconto * percentualDesconto).toFixed(2));
      const valorAssinatura = parseFloat((Number(data.total_fatura) - valorDesconto - Number(data.fatura_concessionaria)).toFixed(2));
      
      // Dados para atualização - garantindo que todos são números
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
        arquivo_concessionaria_nome: data.arquivo_concessionaria_nome || null,
        arquivo_concessionaria_path: data.arquivo_concessionaria_path || null,
        arquivo_concessionaria_tipo: data.arquivo_concessionaria_tipo || null,
        arquivo_concessionaria_tamanho: data.arquivo_concessionaria_tamanho || null
      };
      
      console.log('[useUpdateFatura] Enviando dados para o Supabase:', faturaData);
      
      try {
        const { data: updatedData, error } = await supabase
          .from("faturas")
          .update(faturaData)
          .eq("id", data.id)
          .select("*")
          .single();
        
        if (error) {
          console.error('[useUpdateFatura] Erro do Supabase:', error);
          throw new Error(`Erro ao atualizar fatura: ${error.message}`);
        }
        
        console.log('[useUpdateFatura] Fatura atualizada com sucesso:', updatedData);
        return updatedData;
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

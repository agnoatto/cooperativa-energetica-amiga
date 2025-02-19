
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { lastDayOfMonth, startOfMonth, isBefore } from "date-fns";
import { UnidadeBeneficiaria } from "./types";

export const useGerarFaturas = (currentDate: Date) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: unidades, error: unidadesError } = await supabase
        .from("unidades_beneficiarias")
        .select(`
          id,
          numero_uc,
          apelido,
          data_entrada,
          cooperado:cooperado_id (
            nome
          )
        `)
        .filter('data_saida', 'is', null);

      if (unidadesError) throw unidadesError;

      const mes = currentDate.getMonth() + 1;
      const ano = currentDate.getFullYear();
      const dataVencimento = lastDayOfMonth(currentDate);
      const primeiroDiaMes = startOfMonth(currentDate);

      const unidadesElegiveis = (unidades as UnidadeBeneficiaria[]).filter(unidade => {
        const dataEntrada = new Date(unidade.data_entrada);
        return isBefore(dataEntrada, primeiroDiaMes);
      });

      if (unidadesElegiveis.length === 0) {
        toast.info("Não há unidades elegíveis para geração de faturas neste mês.");
        return [];
      }

      const now = new Date().toISOString();
      const historicoStatusInicial = [{
        status: "gerada" as const,
        data: now,
        observacao: "Fatura gerada automaticamente pelo sistema"
      }];

      const unidadesComFatura = await Promise.all(
        unidadesElegiveis.map(async (unidade) => {
          const { data: faturasExistentes } = await supabase
            .from("faturas")
            .select()
            .eq("unidade_beneficiaria_id", unidade.id)
            .eq("mes", mes)
            .eq("ano", ano);

          if (faturasExistentes && faturasExistentes.length > 0) {
            return null;
          }

          const { error: insertError } = await supabase
            .from("faturas")
            .insert({
              unidade_beneficiaria_id: unidade.id,
              mes,
              ano,
              consumo_kwh: 0,
              total_fatura: 0,
              status: "gerada",
              data_vencimento: dataVencimento.toISOString().split('T')[0],
              economia_acumulada: 0,
              economia_mes: 0,
              saldo_energia_kwh: 0,
              observacao: null,
              historico_status: historicoStatusInicial,
              // Campos obrigatórios adicionados
              fatura_concessionaria: 0,
              iluminacao_publica: 0,
              outros_valores: 0,
              valor_desconto: 0,
              valor_assinatura: 0,
              data_criacao: now,
              data_atualizacao: now
            });

          if (insertError) throw insertError;
          return unidade;
        })
      );

      return unidadesComFatura.filter(Boolean);
    },
    onSuccess: (unidades) => {
      const count = unidades?.length || 0;
      queryClient.invalidateQueries({ queryKey: ["faturas"] });
      if (count > 0) {
        toast.success(`${count} faturas geradas com sucesso!`);
      } else {
        toast.info("Todas as faturas já foram geradas para este mês.");
      }
    },
    onError: (error) => {
      console.error("Erro ao gerar faturas:", error);
      toast.error("Erro ao gerar faturas");
    },
  });
};


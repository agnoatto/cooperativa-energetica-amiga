
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { lastDayOfMonth } from "date-fns";
import { toast } from "sonner";
import { Fatura } from "@/types/fatura";

interface UnidadeBeneficiaria {
  id: string;
  numero_uc: string;
  apelido: string | null;
  cooperado: {
    nome: string;
  };
}

export const useFaturas = (currentDate: Date) => {
  const queryClient = useQueryClient();

  const { data: faturas, isLoading } = useQuery({
    queryKey: ["faturas", currentDate],
    queryFn: async () => {
      // Primeiro, buscar todas as faturas anteriores para calcular a economia acumulada
      const { data: faturasAnteriores } = await supabase
        .from("faturas")
        .select('valor_desconto, unidade_beneficiaria_id')
        .lt('ano', currentDate.getFullYear())
        .order('ano', { ascending: false });

      const { data: faturasAnoAtual } = await supabase
        .from("faturas")
        .select('valor_desconto, unidade_beneficiaria_id, mes')
        .eq('ano', currentDate.getFullYear())
        .lt('mes', currentDate.getMonth() + 1)
        .order('mes', { ascending: false });

      // Combinar todas as faturas anteriores
      const todasFaturasAnteriores = [...(faturasAnteriores || []), ...(faturasAnoAtual || [])];

      // Buscar faturas do mês atual
      const { data, error } = await supabase
        .from("faturas")
        .select(`
          id,
          consumo_kwh,
          valor_total,
          status,
          data_vencimento,
          mes,
          ano,
          fatura_concessionaria,
          total_fatura,
          iluminacao_publica,
          outros_valores,
          valor_desconto,
          economia_acumulada,
          unidade_beneficiaria:unidade_beneficiaria_id (
            id,
            numero_uc,
            apelido,
            endereco,
            percentual_desconto,
            cooperado:cooperado_id (
              nome,
              documento
            )
          )
        `)
        .eq("mes", currentDate.getMonth() + 1)
        .eq("ano", currentDate.getFullYear());

      if (error) {
        toast.error("Erro ao carregar faturas");
        throw error;
      }

      // Calcular economia acumulada para cada fatura
      return data.map(fatura => {
        const economiaAcumulada = todasFaturasAnteriores
          .filter(f => f.unidade_beneficiaria_id === fatura.unidade_beneficiaria.id)
          .reduce((acc, f) => acc + (f.valor_desconto || 0), 0);

        return {
          ...fatura,
          economia_acumulada: economiaAcumulada
        };
      }) as Fatura[];
    },
  });

  const gerarFaturasMutation = useMutation({
    mutationFn: async () => {
      const { data: unidades, error: unidadesError } = await supabase
        .from("unidades_beneficiarias")
        .select(`
          id,
          numero_uc,
          apelido,
          cooperado:cooperado_id (
            nome
          )
        `)
        .filter('data_saida', 'is', null);

      if (unidadesError) throw unidadesError;

      const mes = currentDate.getMonth() + 1;
      const ano = currentDate.getFullYear();
      const dataVencimento = lastDayOfMonth(currentDate);

      const unidadesComFatura = await Promise.all(
        (unidades as UnidadeBeneficiaria[]).map(async (unidade) => {
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
              valor_total: 0,
              status: "pendente",
              data_vencimento: dataVencimento.toISOString().split('T')[0],
              economia_acumulada: 0,
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

  const deleteFaturaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("faturas")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faturas"] });
      toast.success("Fatura excluída com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir fatura:", error);
      toast.error("Erro ao excluir fatura");
    },
  });

  return {
    faturas,
    isLoading,
    gerarFaturas: () => gerarFaturasMutation.mutate(),
    isGenerating: gerarFaturasMutation.isPending,
    deleteFatura: (id: string) => deleteFaturaMutation.mutate(id),
  };
};

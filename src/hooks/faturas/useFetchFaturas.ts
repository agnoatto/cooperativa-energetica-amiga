
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Fatura } from "@/types/fatura";

export const useFetchFaturas = (currentDate: Date) => {
  return useQuery({
    queryKey: ['faturas', currentDate.getMonth() + 1, currentDate.getFullYear()],
    queryFn: async () => {
      console.log('Fetching faturas for:', currentDate);
      // Primeiro, buscar todas as faturas anteriores para calcular a economia acumulada
      const { data: faturasAnteriores, error: errorAnteriores } = await supabase
        .from("faturas")
        .select(`
          valor_desconto,
          unidade_beneficiaria_id,
          mes,
          ano,
          consumo_kwh
        `)
        .lt('ano', currentDate.getFullYear())
        .order('ano', { ascending: false });

      if (errorAnteriores) {
        console.error('Erro ao buscar faturas anteriores:', errorAnteriores);
        throw errorAnteriores;
      }

      const { data: faturasAnoAtual, error: errorAnoAtual } = await supabase
        .from("faturas")
        .select(`
          valor_desconto,
          unidade_beneficiaria_id,
          mes,
          ano,
          consumo_kwh
        `)
        .eq('ano', currentDate.getFullYear())
        .lt('mes', currentDate.getMonth() + 1)
        .order('mes', { ascending: false });

      if (errorAnoAtual) {
        console.error('Erro ao buscar faturas do ano atual:', errorAnoAtual);
        throw errorAnoAtual;
      }

      // Combinar todas as faturas anteriores
      const todasFaturasAnteriores = [
        ...(faturasAnteriores || []),
        ...(faturasAnoAtual || [])
      ].map(f => ({
        mes: f.mes,
        ano: f.ano,
        consumo_kwh: Number(f.consumo_kwh),
        valor_desconto: Number(f.valor_desconto),
        unidade_beneficiaria_id: f.unidade_beneficiaria_id
      }));

      // Buscar faturas do mês atual
      const { data, error } = await supabase
        .from("faturas")
        .select(`
          id,
          consumo_kwh,
          valor_assinatura,
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
          saldo_energia_kwh,
          observacao,
          data_envio,
          data_confirmacao_pagamento,
          historico_status,
          valor_adicional,
          observacao_pagamento,
          data_pagamento,
          arquivo_concessionaria_nome,
          arquivo_concessionaria_path,
          arquivo_concessionaria_tipo,
          arquivo_concessionaria_tamanho,
          data_criacao,
          data_atualizacao,
          unidade_beneficiaria:unidade_beneficiaria_id (
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
        console.error('Erro ao buscar faturas:', error);
        toast.error("Erro ao carregar faturas");
        throw error;
      }

      // Calcular economia acumulada para cada fatura e garantir o tipo correto dos dados
      const faturas: Fatura[] = data.map(fatura => {
        const faturasAnterioresDaUnidade = todasFaturasAnteriores.filter(
          f => f.unidade_beneficiaria_id === fatura.unidade_beneficiaria.id
        );

        const faturaFormatada: Fatura = {
          ...fatura,
          economia_acumulada: faturasAnterioresDaUnidade.reduce(
            (acc, f) => acc + (f.valor_desconto || 0),
            0
          ),
          historico_status: (fatura.historico_status as any[] || []).map(entry => ({
            status: entry.status,
            data: entry.data,
            observacao: entry.observacao
          })),
          historico_faturas: faturasAnterioresDaUnidade.map(f => ({
            mes: f.mes,
            ano: f.ano,
            consumo_kwh: f.consumo_kwh,
            valor_desconto: f.valor_desconto
          })),
          valor_adicional: fatura.valor_adicional || 0,
          observacao_pagamento: fatura.observacao_pagamento || null,
          data_pagamento: fatura.data_pagamento || null,
          arquivo_concessionaria_nome: fatura.arquivo_concessionaria_nome || null,
          arquivo_concessionaria_path: fatura.arquivo_concessionaria_path || null,
          arquivo_concessionaria_tipo: fatura.arquivo_concessionaria_tipo || null,
          arquivo_concessionaria_tamanho: fatura.arquivo_concessionaria_tamanho || null,
          data_criacao: fatura.data_criacao || null,
          data_atualizacao: fatura.data_atualizacao || null,
          consumo_kwh: Number(fatura.consumo_kwh),
          valor_assinatura: Number(fatura.valor_assinatura),
          fatura_concessionaria: Number(fatura.fatura_concessionaria),
          total_fatura: Number(fatura.total_fatura),
          iluminacao_publica: Number(fatura.iluminacao_publica),
          outros_valores: Number(fatura.outros_valores),
          valor_desconto: Number(fatura.valor_desconto),
          saldo_energia_kwh: Number(fatura.saldo_energia_kwh)
        };

        return faturaFormatada;
      });

      return faturas;
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5 // 5 minutos
  });
};


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
      const { data: faturasAnteriores } = await supabase
        .from("faturas")
        .select('valor_desconto, unidade_beneficiaria_id, mes, ano, consumo_kwh')
        .lt('ano', currentDate.getFullYear())
        .order('ano', { ascending: false });

      const { data: faturasAnoAtual } = await supabase
        .from("faturas")
        .select('valor_desconto, unidade_beneficiaria_id, mes, ano, consumo_kwh')
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
        console.error('Erro ao buscar faturas:', error);
        toast.error("Erro ao carregar faturas");
        throw error;
      }

      // Calcular economia acumulada para cada fatura e garantir o tipo correto do historico_status
      return data.map(fatura => ({
        ...fatura,
        economia_acumulada: todasFaturasAnteriores.filter(
          f => f.unidade_beneficiaria_id === fatura.unidade_beneficiaria.id
        ).reduce((acc, f) => acc + (f.valor_desconto || 0), 0),
        historico_status: (fatura.historico_status as any[] || []).map(entry => ({
          status: entry.status,
          data: entry.data,
          observacao: entry.observacao
        })),
        historico_faturas: todasFaturasAnteriores.filter(
          f => f.unidade_beneficiaria_id === fatura.unidade_beneficiaria.id
        ).map(f => ({
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
        data_criacao: fatura.data_criacao || null,
        data_atualizacao: fatura.data_atualizacao || null
      }) as Fatura);
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5 // 5 minutos
  });
};

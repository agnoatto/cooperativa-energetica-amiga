
/**
 * Hook para buscar faturas do período selecionado
 * 
 * Este hook gerencia a consulta de faturas no banco de dados,
 * incluindo informações completas do cooperado, unidade beneficiária
 * e histórico de economia, otimizando a experiência do usuário com
 * dados contextuais relevantes.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Fatura, FaturaStatus } from "@/types/fatura";

export const useFetchFaturas = (currentDate: Date) => {
  const mes = currentDate.getMonth() + 1;
  const ano = currentDate.getFullYear();
  
  // Calcular o mês anterior para buscar as datas de próxima leitura
  const mesAnterior = mes === 1 ? 12 : mes - 1;
  const anoAnterior = mes === 1 ? ano - 1 : ano;
  
  return useQuery({
    queryKey: ['faturas', mes, ano],
    queryFn: async () => {
      console.log('Buscando faturas para:', currentDate);
      console.log('Buscando datas de próxima leitura do mês anterior:', mesAnterior, anoAnterior);
      
      // Calcular a data limite para os últimos 12 meses
      const dataLimite = new Date(currentDate);
      dataLimite.setMonth(dataLimite.getMonth() - 13); // 13 meses para garantir que temos dados suficientes
      const anoLimite = dataLimite.getFullYear();
      const mesLimite = dataLimite.getMonth() + 1;

      // Buscar faturas dos últimos 13 meses (incluindo o mês atual)
      const { data: historicoFaturas, error: errorHistorico } = await supabase
        .from("faturas")
        .select(`
          id,
          mes,
          ano,
          consumo_kwh,
          valor_desconto,
          unidade_beneficiaria_id
        `)
        .or(`ano.gt.${anoLimite},and(ano.eq.${anoLimite},mes.gte.${mesLimite})`)
        .order('ano', { ascending: false })
        .order('mes', { ascending: false });

      if (errorHistorico) {
        console.error('Erro ao buscar histórico de faturas:', errorHistorico);
        throw errorHistorico;
      }

      // Buscar datas de próxima leitura do mês anterior
      const { data: leiturasAnteriores, error: errorLeituras } = await supabase
        .from("faturas")
        .select(`
          unidade_beneficiaria_id,
          data_proxima_leitura
        `)
        .eq("mes", mesAnterior)
        .eq("ano", anoAnterior)
        .not("data_proxima_leitura", "is", null);

      if (errorLeituras) {
        console.error('Erro ao buscar datas de próxima leitura:', errorLeituras);
        // Não interromper o fluxo se falhar, apenas registrar o erro
      }

      // Criar mapa de datas de próxima leitura por unidade beneficiária
      const mapaLeituras = new Map();
      leiturasAnteriores?.forEach(leitura => {
        if (leitura.data_proxima_leitura) {
          mapaLeituras.set(leitura.unidade_beneficiaria_id, leitura.data_proxima_leitura);
        }
      });

      console.log('Mapa de datas de próxima leitura:', Object.fromEntries(mapaLeituras));

      // Buscar faturas do mês atual com informações completas
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
          valor_adicional,
          observacao_pagamento,
          data_pagamento,
          data_proxima_leitura,
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
            cidade,
            uf,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            data_entrada,
            data_saida,
            consumo_kwh,
            possui_geracao_propria,
            potencia_instalada,
            cooperado:cooperado_id (
              id,
              nome,
              documento,
              tipo_pessoa,
              telefone,
              email,
              responsavel_nome,
              responsavel_cpf,
              responsavel_telefone,
              numero_cadastro
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
      
      console.log('Dados recebidos do banco:', data);

      // Processar e formatar as faturas
      const faturas: Fatura[] = data.map(fatura => {
        // Filtrar histórico apenas para a unidade beneficiária atual
        const historicoUnidade = historicoFaturas
          ?.filter(h => h.unidade_beneficiaria_id === fatura.unidade_beneficiaria.id)
          .sort((a, b) => {
            // Ordenar por ano e mês decrescente
            if (a.ano !== b.ano) return b.ano - a.ano;
            return b.mes - a.mes;
          })
          .slice(0, 12); // Pegar exatamente os últimos 12 meses

        // Calcular economia acumulada
        const economiaAcumulada = historicoUnidade?.reduce((total, h) => {
          // Não incluir o mês atual no cálculo da economia acumulada
          if (h.ano === fatura.ano && h.mes === fatura.mes) return total;
          return total + Number(h.valor_desconto);
        }, 0) || 0;

        // Garantir que o status seja um valor válido do tipo FaturaStatus
        const status = fatura.status as FaturaStatus;

        // Verificar se existe data de próxima leitura do mês anterior para esta unidade
        const dataProximaLeituraDoMesAnterior = mapaLeituras.get(fatura.unidade_beneficiaria.id);

        return {
          ...fatura,
          status,
          historico_faturas: historicoUnidade?.map(h => ({
            mes: h.mes,
            ano: h.ano,
            consumo_kwh: Number(h.consumo_kwh),
            valor_desconto: Number(h.valor_desconto)
          })) || [],
          economia_acumulada: economiaAcumulada,
          valor_adicional: fatura.valor_adicional || 0,
          observacao_pagamento: fatura.observacao_pagamento || null,
          data_pagamento: fatura.data_pagamento || null,
          // Usar a data do mês anterior se disponível, senão usar a do mês atual
          data_proxima_leitura: dataProximaLeituraDoMesAnterior || fatura.data_proxima_leitura || null,
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
      });

      return faturas;
    },
    staleTime: 0, // Dados são considerados obsoletos imediatamente
    gcTime: 1000 * 60 * 5, // 5 minutos
    refetchOnMount: true, // Força refetch quando o componente monta
    refetchOnWindowFocus: true // Recarrega quando a janela ganha foco
  });
};

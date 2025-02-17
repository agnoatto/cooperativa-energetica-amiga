
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { lastDayOfMonth, startOfMonth } from "date-fns";
import { toast } from "sonner";
import { PagamentoData, PagamentoStatus } from "@/components/pagamentos/types/pagamento";

export const usePagamentos = (currentDate: Date) => {
  const queryClient = useQueryClient();

  const { data: pagamentos, isLoading } = useQuery({
    queryKey: ["pagamentos", currentDate],
    queryFn: async () => {
      const mes = currentDate.getMonth() + 1;
      const ano = currentDate.getFullYear();
      const primeiroDiaMes = startOfMonth(currentDate);

      // Buscar apenas usinas ativas e com data_inicio anterior ou igual ao mês atual
      const { data, error } = await supabase
        .from("usinas")
        .select(`
          id,
          valor_kwh,
          data_inicio,
          status,
          concessionaria,
          modalidade,
          unidade_usina:unidades_usina!inner(
            numero_uc
          ),
          investidor:investidores!inner(
            nome_investidor
          ),
          pagamentos:pagamentos_usina(
            id,
            geracao_kwh,
            tusd_fio_b,
            valor_tusd_fio_b,
            valor_concessionaria,
            valor_total,
            conta_energia,
            status,
            data_vencimento,
            data_pagamento,
            data_emissao,
            data_confirmacao,
            data_envio,
            mes,
            ano,
            arquivo_comprovante_nome,
            arquivo_comprovante_path,
            arquivo_comprovante_tipo,
            arquivo_comprovante_tamanho,
            observacao,
            observacao_pagamento,
            historico_status,
            send_method,
            empresa_id
          )
        `)
        .eq('status', 'active')
        .lte('data_inicio', primeiroDiaMes.toISOString())
        .is("deleted_at", null);

      if (error) {
        console.error("Erro ao carregar pagamentos:", error);
        toast.error("Erro ao carregar pagamentos");
        return [];
      }

      return data.map(usina => {
        // Ordenar pagamentos por data (ano e mês)
        const pagamentosOrdenados = usina.pagamentos?.sort((a, b) => {
          if (a.ano !== b.ano) return b.ano - a.ano;
          return b.mes - a.mes;
        }) || [];

        // Verificar se já existe pagamento para o mês atual
        const pagamentoDoMes = pagamentosOrdenados.find(p => p.mes === mes && p.ano === ano);
        
        if (pagamentoDoMes) {
          return {
            ...pagamentoDoMes,
            usina: {
              id: usina.id,
              valor_kwh: usina.valor_kwh,
              unidade_usina: usina.unidade_usina,
              investidor: usina.investidor,
              concessionaria: usina.concessionaria,
              modalidade: usina.modalidade
            },
            historico_status: Array.isArray(pagamentoDoMes.historico_status) 
              ? pagamentoDoMes.historico_status.map((h: any) => ({
                  data: h.data,
                  status_anterior: h.status_anterior as PagamentoStatus,
                  novo_status: h.novo_status as PagamentoStatus
                }))
              : []
          };
        }

        // Se não houver pagamento para o mês, retorna null
        return null;
      }).filter(Boolean); // Remove os itens null do array
    },
  });

  const gerarPagamentosMutation = useMutation({
    mutationFn: async () => {
      const mes = currentDate.getMonth() + 1;
      const ano = currentDate.getFullYear();
      const primeiroDiaMes = startOfMonth(currentDate);
      const dataVencimento = lastDayOfMonth(currentDate);

      // Buscar apenas usinas ativas e com data_inicio anterior ou igual ao mês atual
      const { data: usinas, error: usinasError } = await supabase
        .from("usinas")
        .select(`
          id,
          unidade_usina:unidades_usina!inner(
            numero_uc
          ),
          investidor:investidores!inner(
            nome_investidor
          )
        `)
        .eq('status', 'active')
        .lte('data_inicio', primeiroDiaMes.toISOString())
        .is("deleted_at", null);

      if (usinasError) throw usinasError;

      const usinasComPagamento = await Promise.all(
        (usinas as any[]).map(async (usina) => {
          const { data: pagamentosExistentes } = await supabase
            .from("pagamentos_usina")
            .select()
            .eq("usina_id", usina.id)
            .eq("mes", mes)
            .eq("ano", ano);

          if (pagamentosExistentes && pagamentosExistentes.length > 0) {
            return null;
          }

          const { error: insertError } = await supabase
            .from("pagamentos_usina")
            .insert({
              usina_id: usina.id,
              mes,
              ano,
              geracao_kwh: 0,
              valor_tusd_fio_b: 0,
              valor_concessionaria: 0,
              valor_total: 0,
              conta_energia: 0,
              status: "pendente",
              data_vencimento: dataVencimento.toISOString().split('T')[0],
              data_emissao: null,
              data_pagamento: null,
              historico_status: [],
              observacao: null,
              observacao_pagamento: null
            });

          if (insertError) throw insertError;
          return usina;
        })
      );

      return usinasComPagamento.filter(Boolean);
    },
    onSuccess: (usinas) => {
      const count = usinas?.length || 0;
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      if (count > 0) {
        toast.success(`${count} pagamentos gerados com sucesso!`);
      } else {
        toast.info("Todos os pagamentos já foram gerados para este mês.");
      }
    },
    onError: (error) => {
      console.error("Erro ao gerar pagamentos:", error);
      toast.error("Erro ao gerar pagamentos");
    },
  });

  return {
    pagamentos,
    isLoading,
    gerarPagamentos: () => gerarPagamentosMutation.mutate(),
    isGenerating: gerarPagamentosMutation.isPending
  };
};

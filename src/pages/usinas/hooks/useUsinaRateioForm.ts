
/**
 * Hook para gerenciar a lógica do formulário de rateio de usina
 * 
 * Este hook encapsula toda a lógica de negócio necessária para criar e gerenciar
 * rateios de usina, incluindo validações, consultas ao banco de dados e mutações.
 */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { rateioKeys } from "../hooks/useUsinaRateios";

// Definição de tipos para o formulário (sem usar inferência do Zod)
export interface UnidadeRateio {
  unidade_beneficiaria_id: string;
  percentual: number;
}

export interface RateioFormValues {
  usina_id: string;
  data_inicio: string;
  unidades: UnidadeRateio[];
}

export interface UnidadeBeneficiaria {
  id: string;
  numero_uc: string;
  apelido?: string;
  cooperado?: {
    nome: string;
  };
}

// Esquemas Zod independentes para validação
const unidadeSchema = z.object({
  unidade_beneficiaria_id: z.string().min(1, "Selecione uma unidade beneficiária"),
  percentual: z.coerce.number()
    .min(0.01, "Percentual deve ser maior que zero")
    .max(100, "Percentual não pode exceder 100%")
});

const rateioSchema = z.object({
  usina_id: z.string(),
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  unidades: z.array(unidadeSchema).min(1, "Adicione pelo menos uma unidade beneficiária")
}).refine((data) => {
  const totalPercentual = data.unidades.reduce((sum, item) => sum + item.percentual, 0);
  return totalPercentual <= 100;
}, {
  message: "A soma dos percentuais não pode exceder 100%",
  path: ["unidades"]
});

export interface UseUsinaRateioFormProps {
  usinaId: string;
  onOpenChange: (open: boolean) => void;
}

export function useUsinaRateioForm({ usinaId, onOpenChange }: UseUsinaRateioFormProps) {
  const queryClient = useQueryClient();
  const [totalPercentual, setTotalPercentual] = useState(0);
  const [unidadesSelecionadas, setUnidadesSelecionadas] = useState<string[]>([]);

  // Inicialização do formulário com tipo explicitamente definido
  const form = useForm<RateioFormValues>({
    resolver: zodResolver(rateioSchema),
    defaultValues: {
      usina_id: usinaId,
      data_inicio: new Date().toISOString().split('T')[0],
      unidades: [{ unidade_beneficiaria_id: "", percentual: 0 }]
    }
  });

  // Consulta de unidades beneficiárias
  const { data: unidadesBeneficiarias, isLoading: isLoadingUnidades } = useQuery({
    queryKey: ['unidades-beneficiarias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unidades_beneficiarias')
        .select(`
          id,
          numero_uc,
          apelido,
          cooperado:cooperado_id(nome)
        `)
        .eq('deleted_at', null);

      if (error) throw error;
      return data as UnidadeBeneficiaria[];
    }
  });

  // Verifica se já existe um rateio ativo para esta usina
  const { data: rateiosAtivos } = useQuery({
    queryKey: ['rateios-ativos', usinaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rateios')
        .select('id, data_inicio, data_fim')
        .eq('usina_id', usinaId)
        .is('data_fim', null);

      if (error) throw error;
      return data;
    },
    enabled: !!usinaId
  });

  // Mutation para criar rateio
  const criarRateioMutation = useMutation({
    mutationFn: async (values: RateioFormValues) => {
      // 1. Se existir rateio ativo, finaliza ele primeiro
      if (rateiosAtivos && rateiosAtivos.length > 0) {
        const dataFim = new Date(values.data_inicio);
        dataFim.setDate(dataFim.getDate() - 1);
        
        const { error: erroUpdate } = await supabase
          .from('rateios')
          .update({ 
            data_fim: dataFim.toISOString().split('T')[0] 
          })
          .eq('usina_id', usinaId)
          .is('data_fim', null);
          
        if (erroUpdate) throw erroUpdate;
      }

      // 2. Inserir os novos rateios
      const novosRateios = values.unidades.map(unidade => ({
        usina_id: values.usina_id,
        unidade_beneficiaria_id: unidade.unidade_beneficiaria_id,
        percentual: unidade.percentual,
        data_inicio: values.data_inicio,
        data_fim: null
      }));

      const { data, error } = await supabase
        .from('rateios')
        .insert(novosRateios)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Rateio criado com sucesso");
      queryClient.invalidateQueries({ queryKey: rateioKeys.porUsina(usinaId) });
      onOpenChange(false);
      form.reset({
        usina_id: usinaId,
        data_inicio: new Date().toISOString().split('T')[0],
        unidades: [{ unidade_beneficiaria_id: "", percentual: 0 }]
      });
    },
    onError: (error) => {
      toast.error(`Erro ao criar rateio: ${error.message}`);
    }
  });

  // Atualiza o total de percentual quando os valores mudam
  useEffect(() => {
    const values = form.getValues();
    const total = values.unidades.reduce((sum, item) => {
      return sum + (item.percentual || 0);
    }, 0);
    setTotalPercentual(total);
    
    // Atualiza a lista de unidades já selecionadas
    const ids = values.unidades.map(u => u.unidade_beneficiaria_id).filter(Boolean);
    setUnidadesSelecionadas(ids);
  }, [form.watch('unidades')]);

  // Filtra unidades já selecionadas para não mostrar na lista novamente
  const getUnidadesOptions = (currentIndex: number) => {
    if (!unidadesBeneficiarias) return [];
    
    return unidadesBeneficiarias
      .filter(unidade => {
        const currentValue = form.getValues().unidades[currentIndex]?.unidade_beneficiaria_id;
        return !unidadesSelecionadas.includes(unidade.id) || unidade.id === currentValue;
      })
      .map(unidade => ({
        value: unidade.id,
        label: `${unidade.apelido || unidade.numero_uc} - ${unidade.cooperado?.nome || 'Sem cooperado'}`
      }));
  };

  const handleSubmit = (values: RateioFormValues) => {
    criarRateioMutation.mutate(values);
  };

  const adicionarUnidade = () => {
    const unidades = form.getValues().unidades;
    form.setValue('unidades', [
      ...unidades, 
      { unidade_beneficiaria_id: "", percentual: 0 }
    ]);
  };

  const removerUnidade = (index: number) => {
    const unidades = form.getValues().unidades;
    if (unidades.length > 1) {
      form.setValue('unidades', unidades.filter((_, i) => i !== index));
    }
  };

  return {
    form,
    totalPercentual,
    unidadesBeneficiarias,
    isLoadingUnidades,
    rateiosAtivos,
    isPending: criarRateioMutation.isPending,
    getUnidadesOptions,
    handleSubmit,
    adicionarUnidade,
    removerUnidade
  };
}

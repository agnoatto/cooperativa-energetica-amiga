
/**
 * Componente de formulário para criação e edição de rateios de usina
 * 
 * Este componente permite adicionar novos rateios para uma usina,
 * distribuindo percentuais entre unidades beneficiárias selecionadas.
 * Rateios com data de início já definida não podem ser editados.
 */
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { ReactSelectField } from "@/components/ui/react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { rateioKeys } from "../hooks/useUsinaRateios";

interface UsinaRateioFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usinaId: string;
  rateioId?: string;
}

interface UnidadeBeneficiaria {
  id: string;
  numero_uc: string;
  apelido?: string;
  cooperado?: {
    nome: string;
  };
}

// Definindo um tipo simples para a unidade de rateio
type UnidadeRateio = {
  unidade_beneficiaria_id: string;
  percentual: number;
};

// Definindo o schema do Zod de forma mais simples
const rateioSchema = z.object({
  usina_id: z.string().uuid(),
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  unidades: z.array(
    z.object({
      unidade_beneficiaria_id: z.string().uuid({
        message: "Selecione uma unidade beneficiária"
      }),
      percentual: z.coerce.number()
        .min(0.01, "Percentual deve ser maior que zero")
        .max(100, "Percentual não pode exceder 100%")
    })
  ).min(1, "Adicione pelo menos uma unidade beneficiária")
}).refine(data => {
  const totalPercentual = data.unidades.reduce((sum, item) => sum + item.percentual, 0);
  return totalPercentual <= 100;
}, {
  message: "A soma dos percentuais não pode exceder 100%",
  path: ["unidades"]
});

// Usando um type alias direto do schema do Zod
type RateioFormValues = z.infer<typeof rateioSchema>;

export function UsinaRateioForm({ open, onOpenChange, usinaId, rateioId }: UsinaRateioFormProps) {
  const queryClient = useQueryClient();
  const [totalPercentual, setTotalPercentual] = useState(0);
  const [unidadesSelecionadas, setUnidadesSelecionadas] = useState<string[]>([]);

  // Inicializando o formulário com valores simples
  const form = useForm<RateioFormValues>({
    resolver: zodResolver(rateioSchema),
    defaultValues: {
      usina_id: usinaId,
      data_inicio: new Date().toISOString().split('T')[0],
      unidades: [{ unidade_beneficiaria_id: "", percentual: 0 }]
    }
  });

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Rateio</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="data_inicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Unidades Beneficiárias</h4>
                <div className="text-sm">
                  Total: <span className={totalPercentual > 100 ? "text-red-500 font-bold" : ""}>
                    {totalPercentual.toFixed(2)}%
                  </span>
                </div>
              </div>

              {rateiosAtivos && rateiosAtivos.length > 0 && (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  Já existe um rateio ativo para esta usina. Ao criar um novo, o rateio atual 
                  será automaticamente finalizado na data anterior ao início do novo rateio.
                </div>
              )}

              {form.getValues().unidades.map((_, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <FormField
                    control={form.control}
                    name={`unidades.${index}.unidade_beneficiaria_id`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <ReactSelectField
                          form={form}
                          name={`unidades.${index}.unidade_beneficiaria_id`}
                          label="Unidade Beneficiária"
                          options={getUnidadesOptions(index)}
                          isLoading={isLoadingUnidades}
                          placeholder="Selecione uma unidade"
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`unidades.${index}.percentual`}
                    render={({ field }) => (
                      <FormItem className="w-28">
                        <FormLabel>Percentual</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                              }}
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                              %
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removerUnidade(index)}
                    className="mt-8"
                    disabled={form.getValues().unidades.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {form.formState.errors.unidades && typeof form.formState.errors.unidades.message === 'string' && (
                <div className="text-red-500 text-sm">{form.formState.errors.unidades.message}</div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={adicionarUnidade}
                disabled={unidadesSelecionadas.length >= (unidadesBeneficiarias?.length || 0)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Unidade
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={criarRateioMutation.isPending}>
                {criarRateioMutation.isPending ? "Salvando..." : "Salvar Rateio"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

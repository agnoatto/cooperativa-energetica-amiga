
/**
 * Componente que renderiza os campos básicos do formulário de unidade beneficiária
 * 
 * Este componente exibe campos como número de UC, apelido, percentual de desconto,
 * consumo médio mensal e template de cálculo de fatura.
 */
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { CalculoFaturaTemplate } from '@/types/template';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';

export function UnidadeBeneficiariaBasicInfo({ form }) {
  const [templates, setTemplates] = useState<CalculoFaturaTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  useEffect(() => {
    async function fetchTemplates() {
      setIsLoadingTemplates(true);
      try {
        const { data, error } = await supabase.rpc('get_all_calculo_fatura_templates');
        
        if (error) {
          console.error("Erro ao buscar templates:", error);
          return;
        }
        
        setTemplates(data as CalculoFaturaTemplate[]);
      } catch (error) {
        console.error("Erro ao buscar templates de cálculo:", error);
      } finally {
        setIsLoadingTemplates(false);
      }
    }

    fetchTemplates();
  }, []);

  return (
    <div className="grid gap-4 py-4">
      <FormField
        control={form.control}
        name="numero_uc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número da UC</FormLabel>
            <FormControl>
              <Input placeholder="Número da UC" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="apelido"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apelido (opcional)</FormLabel>
            <FormControl>
              <Input placeholder="Apelido para identificação" {...field} />
            </FormControl>
            <FormDescription>
              Um nome para facilitar a identificação desta unidade
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="percentual_desconto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Percentual de Desconto (%)</FormLabel>
            <FormControl>
              <CurrencyInput
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
                placeholder="0,00"
                decimalScale={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="consumo_kwh"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consumo Médio Mensal (kWh)</FormLabel>
            <FormControl>
              <CurrencyInput
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
                placeholder="0,00"
                decimalScale={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="calculo_fatura_template_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Template de Cálculo</FormLabel>
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
              disabled={isLoadingTemplates}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template de cálculo" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.nome} {template.is_padrao && "(Padrão)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Template que será usado para calcular os valores das faturas desta unidade
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
